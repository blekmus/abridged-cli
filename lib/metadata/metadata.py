#!/bin/python3

import logging
from rich.text import Text
from datetime import datetime
from rich.console import Console
import argparse
import ffmpeg
import shutil
from os import path
import subprocess
import json
from yt_dlp import YoutubeDL
import os

# Init args
parser = argparse.ArgumentParser(
    description='Check video type/metadata/info-json/thumbnail validity')
parser.add_argument('location',
                    metavar='PATH',
                    type=str,
                    nargs=1,
                    help='Path to abridged directory')
parser.add_argument('specific',
                    metavar='PATH',
                    type=str,
                    nargs=1,
                    help='Specific path')

# Get args
args = parser.parse_args()
location = args.location[0]
specific = args.specific[0]

# Init logging
logging.basicConfig(level=logging.DEBUG,
                    datefmt="%I:%M:%S",
                    format="[%(asctime)s] %(levelname)s: %(message)s",
                    filename=path.join(location,
                                       'metadata [abridged-cli].log'),
                    filemode="a")


# Logging and rich console output handler
def logger(msg, level='info'):
    if level != 'debug':
        timestamp = datetime.now().strftime("%I:%M:%S")

        console = Console()
        console.print(f"[{timestamp}]", end=" ")
        console.print(f"{msg}", highlight=False)

    msg = Text().from_markup(msg)

    if level == 'debug':
        logging.debug(msg)
    elif level == 'warning':
        logging.warning(msg)
    elif level == 'error':
        logging.error(msg)
    else:
        logging.info(msg)


# Check and return youtube url
def check_metadata(file):
    try:
        yt_url = ffmpeg.probe(file)['format']['tags']['PURL']
        return yt_url
    except Exception:
        return None


# Create a backup of file before processing
def create_backup(file):
    if path.exists(file + '.bak'):
        return

    shutil.copy2(file, file + '.bak')


# Run and save ytdl output to log
def run_ytdl(shell_command):
    with open(path.join(location, 'metadata [abridged-cli].log'),
              "a") as outfile:
        subprocess.run(shell_command,
                       shell=True,
                       stdout=outfile,
                       stderr=outfile)


# Return correct format for extension
def get_formats(yt_url, ext):
    with YoutubeDL({'logger': logging}) as ytdl:
        info = ytdl.extract_info(yt_url, download=False)
        format_id = [f for f in info['formats']
                     if f['ext'] == ext][-1]['format_id']
        return format_id


def check_attachments(filename):
    try:
        with open('metadata [abridged-cli].log', "a") as logfile:
            output = subprocess.run(f"mkvmerge -F json -i \"{filename}\"",
                                    shell=True,
                                    stdout=subprocess.PIPE,
                                    stderr=logfile)

            logger(output.stdout.decode('utf-8'), 'debug')

            attachments = json.loads(output.stdout.decode('utf-8'))['attachments']

        thumbnail = [
            item for item in attachments
            if item['content_type'].startswith('image/')
        ]
        info_json = [
            item for item in attachments if 'info.json' in item['file_name'] or 'vid.info.json' in item['file_name']
        ]

        thumbnail = True if thumbnail != [] else False
        info_json = True if info_json != [] else False

        return thumbnail, info_json
    except:
        return False, False


def handle_mkvs(files, entry_dir):
    for file in files:
        # resolve filename of mkv file
        filename = path.join(entry_dir, file)

        # check if file has thumbnail and info_json
        [thumbnail, info_json] = check_attachments(filename)

        # get url from mkv metadata tags
        yt_url = check_metadata(filename)

        # check if metadata exists
        if not yt_url:
            logger(f"MKV - No metadata found - '{path.basename(file)}'",
                   'warning')

            yt_url = input('Enter youtube url/id: ')

            if yt_url == '':
                logger("MKV - No yt_url supplied. Skipping", 'debug')
                continue

            create_backup(filename)

            dl_command = f"yt-dlp --sub-langs 'en.*,-live_chat' --embed-subs --embed-thumbnail --embed-metadata --embed-info-json --remux-video mkv \"{yt_url}\" -o \"{filename}\""

            logger("MKV - Running yt-dlp", 'debug')
            logger(dl_command, 'debug')
            run_ytdl(dl_command)
            logger('MKV - Metadata embedded', 'debug')
            continue

        if not (info_json and thumbnail):
            logger(
                f"MKV - No info_json/thumbnail found - '{path.basename(file)}'",
                'warning')

            create_backup(filename)

            dl_command = f"yt-dlp --sub-langs 'en.*,-live_chat' --embed-subs --embed-info-json --embed-thumbnail --remux-video mkv \"{yt_url}\" -o \"{filename}\""

            logger("MKV - Running yt-dlp", 'debug')
            logger(dl_command, 'debug')
            run_ytdl(dl_command)
            logger('MKV - info_json/thumbnail embedded', 'debug')


def handle_mp4s(files, entry_dir):
    for file in files:
        filename = path.join(entry_dir, file)
        [thumbnail, info_json] = check_attachments(filename)
        yt_url = check_metadata(filename)

        if not yt_url:
            logger(f"MP4 - No metadata found - '{path.basename(file)}'",
                   'warning')

            yt_url = input('Enter youtube url/id: ')

            if yt_url == '':
                logger("MP4 - No yt_url supplied. Skipping", 'debug')
                continue

            format_id = get_formats(
                yt_url,
                path.splitext(filename)[1].replace('.', ''))

            if not format_id:
                continue

            create_backup(filename)

            dl_command = f"yt-dlp --remux-video mkv --sub-langs 'en.*,-live_chat' --embed-subs --embed-thumbnail --embed-metadata --embed-info-json \"{yt_url}\" -o \"{filename}\" -f {format_id}"

            logger("MP4 - Running yt-dlp", level='debug')
            logger(dl_command, level='debug')
            run_ytdl(dl_command)
            logger('MP4 - Metadata embedded', level='debug')
            continue

        format_id = get_formats(yt_url,
                                path.splitext(filename)[1].replace('.', ''))

        if not (info_json and thumbnail):
            logger(
                f"MP4 - No info_json/thumbnail found - '{path.basename(file)}'",
                'warning')

            create_backup(filename)

            dl_command = f"yt-dlp --embed-info-json --embed-thumbnail --remux-video mkv -f {format_id} \"{yt_url}\" -o \"{filename}\""

            logger("MP4 - Running yt-dlp", 'debug')
            logger(dl_command, 'debug')
            run_ytdl(dl_command)
            logger('MP4 - info_json/thumbnail embedded', 'debug')


def handle_webm(files, entry_dir):
    for file in files:
        filename = path.join(entry_dir, file)
        [thumbnail, info_json] = check_attachments(filename)
        yt_url = check_metadata(filename)

        if not yt_url:
            logger(f"WEBM - No metadata found - '{path.basename(file)}'",
                   'warning')

            yt_url = input('Enter youtube url/id: ')

            if yt_url == '':
                logger("WEBM - No yt_url supplied. Skipping", 'debug')
                continue

            format_id = get_formats(
                yt_url,
                path.splitext(filename)[1].replace('.', ''))

            create_backup(filename)

            dl_command = f"yt-dlp --remux-video mkv --sub-langs 'en.*,-live_chat' --embed-subs --embed-thumbnail --add-metadata --write-info-json \"{yt_url}\" -o \"{filename}\" -f {format_id}"

            logger("WEBM - Running yt-dlp", level='debug')
            logger(dl_command, level='debug')
            run_ytdl(dl_command)
            logger('WEBM - Metadata embedded', level='debug')
            continue

        format_id = get_formats(yt_url,
                                path.splitext(filename)[1].replace('.', ''))

        if not (info_json and thumbnail):
            logger(
                f"WEBM - No info_json/thumbnail found - '{path.basename(file)}'",
                'warning')

            create_backup(filename)

            dl_command = f"yt-dlp --embed-info-json --embed-thumbnail --remux-video mkv -f {format_id} \"{yt_url}\" -o \"{filename}\""

            logger("WEBM - Running yt-dlp", 'debug')
            logger(dl_command, 'debug')
            run_ytdl(dl_command)
            logger('WEBM - info_json/thumbnail embedded', 'debug')


def handle_base_path(base_path):
    # Get entry_type dirs in base_path directories
    entry_types = os.listdir(base_path)

    if 'Other' in entry_types:
        entry_types.remove('Other')

    entry_types = [file for file in entry_types if path.isdir(file)]

    # Loop through all entry_types
    for entry_type in entry_types:
        # Get all entries in entry_type dir
        entries = os.listdir(path.join(base_path, entry_type))
        entries = [
            file for file in entries
            if path.isdir(path.join(base_path, entry_type, file))
        ]

        logger(
            f"Working on ({len(entries)}) directories in [green]{entry_type}[/ green]"
        )

        # Loop through all entries of entry_type
        for entry in entries:
            entry = path.join(base_path, entry_type, entry)
            logger(f"Processing [blue]'{entry}'[/ blue]")

            # Get all files in entry dir
            entry_files = os.listdir(entry)

            # Resolve file type
            video_files_mkv = [
                file for file in entry_files if file.endswith('.mkv')
            ]
            video_files_mp4 = [
                file for file in entry_files if file.endswith('.mp4')
            ]
            video_files_webm = [
                file for file in entry_files if file.endswith('.webm')
            ]

            # Handle mkv files
            handle_mkvs(video_files_mkv, entry)
            handle_mp4s(video_files_mp4, entry)
            handle_webm(video_files_webm, entry)


def handle_entry_type_path(entry_type_path):
    # Get all entries in entry_type dir
    entries = os.listdir(entry_type_path)
    entries = [
        file for file in entries
        if path.isdir(path.join(entry_type_path, file))
    ]

    logger(
        f"Working on ({len(entries)}) directories in [green]{entry_type_path}[/ green]"
    )

    # Loop through all entries of entry_type
    for entry in entries:
        entry = path.join(entry_type_path, entry)
        logger(f"Processing [blue]'{entry}'[/ blue]")

        # Get all files in entry dir
        entry_files = os.listdir(entry)

        # Resolve file type
        video_files_mkv = [
            file for file in entry_files if file.endswith('.mkv')
        ]
        video_files_mp4 = [
            file for file in entry_files if file.endswith('.mp4')
        ]
        video_files_webm = [
            file for file in entry_files if file.endswith('.webm')
        ]

        # Handle mkv files
        handle_mkvs(video_files_mkv, entry)
        handle_mp4s(video_files_mp4, entry)
        handle_webm(video_files_webm, entry)


def handle_entry_path(entry_path):
    entry = path.join(entry_path)
    logger(f"Processing [blue]'{entry}'[/ blue]")

    # Get all files in entry dir
    entry_files = os.listdir(entry)

    # Resolve file type
    video_files_mkv = [file for file in entry_files if file.endswith('.mkv')]
    video_files_mp4 = [file for file in entry_files if file.endswith('.mp4')]
    video_files_webm = [file for file in entry_files if file.endswith('.webm')]

    # Handle mkv files
    handle_mkvs(video_files_mkv, entry)
    handle_mp4s(video_files_mp4, entry)
    handle_webm(video_files_webm, entry)


def location_type_handler(abridged_loc, specific_loc) -> str:
    try:
        if path.basename(abridged_loc) == path.basename(specific_loc):
            return 'base_dir'

        if specific_loc.split(path.sep)[-2] == path.basename(abridged_loc):
            return 'entry_type_dir'

        if specific_loc.split(path.sep)[-3] == path.basename(abridged_loc):
            return 'entry_dir'

        return None
    except IndexError:
        return None


def main(abridged_loc, specific_loc):
    logger("Starting metadata checker")

    # resolve specific location
    path_type = location_type_handler(abridged_loc, specific_loc)

    # handle resolved path_type
    if path_type == 'base_dir':
        handle_base_path(specific_loc)
    elif path_type == 'entry_type_dir':
        handle_entry_type_path(specific_loc)
    elif path_type == 'entry_dir':
        handle_entry_path(specific_loc)
    else:
        logger("[red]Invalid location[/ red]", 'error')
        return

    logger("[blue]Done![/ blue]")
    return


if __name__ == '__main__':
    main(location, specific)

#!/bin/python3

import logging
from rich.text import Text
from datetime import datetime
from rich.console import Console
import argparse
import os
import ffmpeg
import shutil
from os import path
import subprocess
import json
from yt_dlp import YoutubeDL


# Init args
parser = argparse.ArgumentParser(description='Check video type/metadata/info-json/thumbnail validity')
parser.add_argument('location', metavar='PATH', type=str, nargs=1, help='Path to parent directory')

# Get args
args = parser.parse_args()
location = args.location[0]


# Init logging
logging.basicConfig(
    level=logging.DEBUG,
    datefmt="%I:%M:%S",
    format="[%(asctime)s] %(levelname)s: %(message)s",
    filename=path.join(location, '[abridged-cli] metadata.log'),
    filemode="a"
)


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
    with open(path.join(location, '[abridged-cli] metadata.log'), "a") as outfile:
        subprocess.run(shell_command, shell=True, stdout=outfile, stderr=outfile)


# Return correct format for extension
def get_formats(yt_url, ext):
    with YoutubeDL({'logger': logging}) as ytdl:
        info = ytdl.extract_info(yt_url, download=False)
        format_id = [f for f in info['formats']
                    if f['ext'] == ext][-1]['format_id']
        return format_id
        

# Check attachments
def check_attachments(filename):
    with open('script.log', "a") as logfile:
        output = subprocess.run(
            f"mkvmerge -F json -i \"{filename}\"", shell=True, stdout=subprocess.PIPE, stderr=logfile)

        # logger(output.stdout.decode('utf-8'), 'debug')

        attachments = json.loads(output.stdout.decode('utf-8'))['attachments']

    thumbnail = [item for item in attachments if item['content_type'].startswith('image/')]
    info_json = [item for item in attachments if 'info.json' in item['file_name']]

    thumbnail = True if thumbnail != [] else False
    info_json = True if info_json != [] else False

    return thumbnail, info_json


# Handle mkv video files
def handle_mkvs(files, base_dir, entry_dir):
    for file in files:
        # resolve filename of mkv file
        filename = path.join(base_dir, entry_dir, file)

        # check if file has thumbnail and info_json
        [thumbnail, info_json] = check_attachments(filename)

        # get url from mkv metadata tags
        yt_url = check_metadata(filename)

        # check if metadata exists
        if not yt_url:
            logger(f"MKV - No metadata found - '{path.basename(file)}'", 'warning')

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
            logger(f"MKV - No info_json/thumbnail found - '{path.basename(file)}'", 'warning')

            create_backup(filename)

            dl_command = f"yt-dlp --sub-langs 'en.*,-live_chat' --embed-subs --embed-info-json --embed-thumbnail --remux-video mkv \"{yt_url}\" -o \"{filename}\""

            logger("MKV - Running yt-dlp", 'debug')
            logger(dl_command, 'debug')
            run_ytdl(dl_command)
            logger('MKV - info_json/thumbnail embedded', 'debug')


# Handle mp4 video files
def handle_mp4s(files, base_dir, entry_dir):
    for file in files:
        filename = path.join(base_dir, entry_dir, file)
        [thumbnail, info_json] = check_attachments(filename)
        yt_url = check_metadata(filename)

        if not yt_url:
            logger(f"MP4 - No metadata found - '{path.basename(file)}'", 'warning')

            yt_url = input('Enter youtube url/id: ')

            if yt_url == '':
                logger("MP4 - No yt_url supplied. Skipping", 'debug')
                continue

            format_id = get_formats(
                yt_url, path.splitext(filename)[1].replace('.', ''))

            if not format_id:
                continue

            create_backup(filename)

            dl_command = f"yt-dlp --remux-video mkv --sub-langs 'en.*,-live_chat' --embed-subs --embed-thumbnail --embed-metadata --embed-info-json \"{yt_url}\" -o \"{filename}\" -f {format_id}"

            logger("MP4 - Running yt-dlp", level='debug')
            logger(dl_command, level='debug')
            run_ytdl(dl_command)
            logger('MP4 - Metadata embedded', level='debug')
            continue

        format_id = get_formats(
            yt_url, path.splitext(filename)[1].replace('.', ''))

        if not (info_json and thumbnail):
            logger(f"MP4 - No info_json/thumbnail found - '{path.basename(file)}'", 'warning')

            create_backup(filename)

            dl_command = f"yt-dlp --embed-info-json --embed-thumbnail --remux-video mkv -f {format_id} \"{yt_url}\" -o \"{filename}\""

            logger("MP4 - Running yt-dlp", 'debug')
            logger(dl_command, 'debug')
            run_ytdl(dl_command)
            logger('MP4 - info_json/thumbnail embedded', 'debug')


# Handle webm video files
def handle_webm(files, base_dir, entry_dir):
    for file in files:
        filename = path.join(base_dir, entry_dir, file)
        [thumbnail, info_json] = check_attachments(filename)
        yt_url = check_metadata(filename)

        if not yt_url:
            logger(f"WEBM - No metadata found - '{path.basename(file)}'", 'warning')

            yt_url = input('Enter youtube url/id: ')

            if yt_url == '':
                logger("WEBM - No yt_url supplied. Skipping", 'debug')
                continue

            format_id = get_formats(
                yt_url, path.splitext(filename)[1].replace('.', ''))

            create_backup(filename)

            dl_command = f"yt-dlp --remux-video mkv --sub-langs 'en.*,-live_chat' --embed-subs --embed-thumbnail --embed-metadata --embed-info-json \"{yt_url}\" -o \"{filename}\" -f {format_id}"

            logger("WEBM - Running yt-dlp", level='debug')
            logger(dl_command, level='debug')
            run_ytdl(dl_command)
            logger('WEBM - Metadata embedded', level='debug')
            continue

        format_id = get_formats(
            yt_url, path.splitext(filename)[1].replace('.', ''))

        if not (info_json and thumbnail):
            logger(f"WEBM - No info_json/thumbnail found - '{path.basename(file)}'", 'warning')

            create_backup(filename)

            dl_command = f"yt-dlp --embed-info-json --embed-thumbnail --remux-video mkv -f {format_id} \"{yt_url}\" -o \"{filename}\""

            logger("WEBM - Running yt-dlp", 'debug')
            logger(dl_command, 'debug')
            run_ytdl(dl_command)
            logger('WEBM - info_json/thumbnail embedded', 'debug')


def main():
    entry_parents = [path.join(location, 'Series'), path.join(location, 'Shots'), path.join(location, 'Shorts')]

    for entry_parent in entry_parents:
        logger(f"Working on [green]{path.basename(entry_parent)}[/ green]")
        
        # Get entry dirs in location dir
        base_dirs = os.listdir(entry_parent)
        base_dirs = [base_dir for base_dir in base_dirs if path.isdir(
            path.join(entry_parent, base_dir))]

        logger(f"Found {len(base_dirs)} directories")

        for entry_dir in base_dirs:
            logger(f"Processing [blue]'{entry_dir}'[/ blue]")

            # Get all files in entry dir
            entry_files = os.listdir(path.join(entry_parent, entry_dir))

            video_files_mkv = [
                file for file in entry_files if file.endswith('.mkv')]
            video_files_mp4 = [
                file for file in entry_files if file.endswith('.mp4')]
            video_files_webm = [
                file for file in entry_files if file.endswith('.webm')]

            handle_mkvs(video_files_mkv, entry_parent, entry_dir)
            handle_mp4s(video_files_mp4, entry_parent, entry_dir)
            handle_webm(video_files_webm, entry_parent, entry_dir)

    logger("[blue]Done![/ blue]")


if __name__ == '__main__':
    main()

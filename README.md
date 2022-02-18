# abridged-cli
Abridged Anime. But in the Terminal! <br>
I use this CLI to manage and watch my local collection/archive of abridged anime.

## File Structure
```
Abridged/
├─ Series/
│  ├─ [Kurosai] Boundary Bridge/
│  │  ├─ covers/
│  │  │  ├─ 1.jpg
│  │  │  ├─ 2.jpg
│  │  │  └─ ...
│  │  ├─ info.txt
│  │  ├─ Episode 1 - Suck that Meat of Mine.mkv
│  │  ├─ Episode 2 - Nigasaki in Paris.mkv
│  │  ├─ OVA 1 - Other.mkv
│  │  ├─ Movie 1 - Another.mkv
│  │  └─ ...
│  └─ ...
├─ Shots/
│  ├─ [2GS BootLegged] Talking To God/
│  │  ├─ info.txt
│  │  ├─ cover.jpg
│  │  └─ 1.mkv
│  └─ ...
└─ Shorts/
   ├─ [bearfist] Mekakucity Slackers/
   │  ├─ info.txt
   │  ├─ cover.jpg
   │  ├─ 1.mkv
   └─ ...
```

## Help
``` ini
USAGE
    abridged-cli [OPTIONS]

Abridged Anime. But in the Terminal!

OPTIONS
    -s, --server
    Springs up a python FTP server on 0.0.0.0:2121 for the abridged folder

    -f, --format
    Formats Shorts & Shots entries to the standard structure

    -m, --metadata
    Check and fix video file metadata of all entries
    Optionally, specify a specify path. Entry/Entry type dirs are valid

TUI
    q - exit
    / - search
    o - open dir
    i - add/edit info.txt

    Press 'Left' and 'Right' arrows to navigate
    through entry types. Clicking menu items with the
    cursor does the same thing.

    Press '/' to search. Search only works in the
    entry list page. When searching, the entry list
    is non interactive. To make it interactive again
    the search must be completed by pressing 'Enter'.
    When typing, pressing 'Delete' will clear the
    query.

    Pressing 'o' in the entry list menu opens the
    abridged directory. To visit an entry directory
    press 'o' inside of an entry item when the
    content list is in view.

    Scroll using the mouse to navigate faster
    through a list. However, you cannot open an
    entry nor can you watch a content item by
    clicking on it. You must highlight the item
    and press 'Enter' for it to work.

    Pressing 'i' inside of an entry (content list)
    will open the text editor defined by
    $EDITOR or $VISUAL. You can either edit the
    existing info.txt file or this will create a
    new one.
```

## Screenshots
![entry_list](https://user-images.githubusercontent.com/47277246/151655381-1d32cb96-99f6-435f-b34e-689f056101a3.png)
![content_list](https://user-images.githubusercontent.com/47277246/151655387-be5b434f-6475-4def-b743-7eea709dd60b.png)



## Guidelines

### General
~~~ ini
[info.txt]
This file contains additional information about an entry.
It may include archival notes, playlist descriptions etc.

[videos]
All videos contain metadata attached to the mkv.
This includes the video thumbnail, info.json file, general metadata.
~~~

### Series
~~~ ini
[DESC]
A set of entries bound by a common relationship.
They may be common as in an episodic nature.
Or common as in by the same creator.
Definition of common is flexible as long as the relation stands.
All series entries should have multiple videos.

[MODEL]
Directory follows "[creator] entry name" scheme
Covers are inside a "covers" directory
Individual cover names are flexible
Entry videos are in the "Type n.n - title" scheme
If there is no title, follow "Type n.n"
If there is no decimal, follow "Type n"
Where "Type" is one of "Episode", "OVA", "Movie"
Where "n.n" is the episode number
Optionally, use decimals for further classification
May contain an "info.txt" file

[EX]
Series/
├─ [The Dastails] Nisekoi Abridged/
│  ├─ covers/
│  │  ├─ 1.jpg
│  │  ├─ 2.jpg
│  │  └─ ...
│  ├─ info.txt
│  ├─ Episode 1 - Pilot.mkv
│  ├─ Episode 1.5 - Takin it Slow.mkv
│  ├─ Episode 2 - Banana Tuesdays.mkv
│  ├─ OVA 1 - BROsekoi.mkv
│  └─ Movie 1 - NiseBOO.mkv
~~~

### Shots
~~~ ini
[DESC]
Videos that cover most of the original shows content.
Or videos that follow a coherent plot line, original or not.
All shots should be unit entries.

[MODEL]
Directory follows "[creator] entry name" scheme
Cover is directly inside. Named "cover"
Entry video is named "1"
May contain an "info.txt" file

[EX]
Shots/
 ├─ [2GS BootLegged] Talking To God/
 │  ├─ info.txt
 │  ├─ cover.jpg
 │  └─ 1.mkv
~~~

### Shorts
~~~ ini
[DESC]
Videos that are short and cover only a short portion of its original material.
They may be random as well. Without a coherent story or plot.
All shorts should be unit entries.

[MODEL]
Directory follows "[creator] entry name" scheme
Cover is directly inside. Named "cover"
Entry video is named "1"
May contain an "info.txt" file

[EX]
Shorts/
 ├─ [2GS BootLegged] Talking To God/
 │  ├─ info.txt
 │  ├─ cover.jpg
 │  └─ 1.mkv
~~~

### yt-dlp
~~~ bash
# command used to archive
yt-dlp --sub-langs 'en.*,-live_chat' --embed-subs --write-thumbnail --embed-thumbnail --embed-metadata --embed-info-json --remux-video mkv -f <formal> <url>
~~~

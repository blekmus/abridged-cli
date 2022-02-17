# abridged-cli
Abridged Anime. But in the Terminal! <br>
I use this CLI to manage and watch my local collection/archive of abridged anime.

## File Structure of Abridged Directory
```
Abridged/
├─ Series/
│  ├─ [Kurosai] Boundary Bridge/
│  │  ├─ covers/
│  │  │  ├─ 1.jpg
│  │  │  ├─ 2.jpg
│  │  │  ├─ ...
│  │  ├─ info.txt
│  │  ├─ Episode 1 - Suck that Meat of Mine.mkv
│  │  ├─ Episode 2 - Nigasaki in Paris.mkv
│  │  ├─ OVA 1 - Other.mkv
│  │  ├─ Movie 1 - Another.mkv
│  │  ├─ ...
│  ├─ ...
├─ Shots/
│  ├─ [2GS BootLegged] Talking To God/
│  │  ├─ info.txt
│  │  ├─ cover.jpg
│  │  ├─ 1.mkv
│  ├─ ...
├─ Shorts/
│  ├─ [bearfist] Mekakucity Slackers/
│  │  ├─ info.txt
│  │  ├─ cover.jpg
│  │  ├─ 1.mkv
│  ├─ ...
```

## Help
```
USAGE
    abridged-cli [OPTIONS]

Abridged Anime. But in the Terminal!

OPTIONS
    -s, --server
    Springs up a python FTP server on 0.0.0.0 for the abridged folder

    -f, --format
    Formats Shorts & Shots entries to the standard structure

    -m, --metadata
    Check and fix video file metadata of all entries

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

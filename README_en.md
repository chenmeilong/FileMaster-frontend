<div align="center">
<img src="./img/logo.png" style="zoom:100%;" />
</div>
<div align="center">
<a href="./README_en.md" style="text-decoration: none;"><img src="https://img.shields.io/badge/English-orange"/>
<a href="./README.md" style="text-decoration: none;"><img src="https://img.shields.io/badge/简体中文-blue"/>
<a href="https://github.com/chenmeilong/FileMaster-frontend" style="text-decoration: none;"><img src="https://img.shields.io/badge/Front--end_Address-yellow"/>
<a href="https://github.com/chenmeilong/FileMaster-backend" style="text-decoration: none;"><img src="https://img.shields.io/badge/Back--end_Address-green"/>
<a href="http://fm.mileschen.cn/" style="text-decoration: none;"><img src="https://img.shields.io/badge/Experience_Address-brightgreen"/></a>
</div>
<div align="center">
<img src="https://img.shields.io/badge/-Node-red"/>
<img src="https://img.shields.io/badge/-Vite-brightgreen"/>
<img src="https://img.shields.io/badge/-TS-lightgrey"/>
<img src="https://img.shields.io/badge/-Eslint-blue"/>
<img src="https://img.shields.io/badge/-Prettier-blueviolet"/>
<img src="https://img.shields.io/badge/-Stylelint-orange"/>
<img src="https://img.shields.io/badge/-Husky-green"/>
<img src="https://img.shields.io/badge/-Commitlint-yellow"/>
<img src="https://img.shields.io/badge/-Lint--staged-yellowgreen"/>
</div>
<div align="center">
<img src="https://img.shields.io/badge/react-18.2.0-yellowgreen"/>
<img src="https://img.shields.io/badge/redux-4.2.1-orange"/>
<img src="https://img.shields.io/badge/material--ui-4.12.4-blueviolet"/>
<img src="https://img.shields.io/badge/react--image--editor-3.15.2-blue"/>
<img src="https://img.shields.io/badge/axios-0.14.0-lightgrey"/>
<img src="https://img.shields.io/badge/react--beautiful--dnd-13.1.1-red"/>
<img src="https://img.shields.io/badge/react--dropzone-14.2.3-yellow"/>
</div>
<hr>
<img src="" width="100%;"/>

## Feature
- Expandable folder tree
- List view and grid view
- Small icon and thumbnail toggle
- Reload folder tree and folder contents
- Drag-and-drop operation for moving files and folders
- Right-click menu for managing files and folders
- Multiple selection of files and folders, including select all, unselect all, deselect and click select
- Sorting files and folders: by date, size, name (ascending, descending)
- Navigate paths, including backward, forward, and back to root
- Copy, paste, quick copy, delete, add and rename folders and files
- Emptying folder contents
- Select, drag and drop for multiple file uploads
- Decompress, compress specified files
- Display file and folder details
- Image editing and preview functions
- Download files
- Switch between widescreen and narrow screen modes
- Auto-disappearing bubble message alert
- Bottom tips for selecting folders or files

## Quick start
1. Install the dependency environment
> `pnpm i` or `yarn`

2. Start the project
> `pnpm dev` or `yarn dev`

## Custom middleware architecture diagram
! [](. /img/redux.jpg)

## To be done
- [X] custom middleware to implement API request actionization, improve API maintainability
- [X] Permission management for operations, different files have different functions disable
- [X] drag effect implementation, file or folder dragged to the top of the folder, the folder will automatically open
- [X] Centralized file icon status management
- [ ] Performance optimization, using useCallback, useMemo and other Hook to optimize the callback function declaration
- [ ] Fade in/fade out animation of message alert form, improve message queue
- [ ] More detailed type definition
- [ ] Text file editing, saving
- [ ] File dragging, select and move in, react-beautiful-dnd does not support this operation, need to replace react-dnd
- [ ] File search
- [ ] Protected files do not support path move, delete, modify
- [ ] Merge button group components
- [ ] Refactoring axios request API using async, await
- [ ] Common shortcut key binding
- [ ] Removing TopBar, optimizing right-click menu
- [ ] Path bar, path jumping
- [ ] Theme customization, window size customization
- [ ] Upload npm to improve the installation and documentation

## Contribute
Welcome PRs! If you want to contribute to this project, you can submit a pr or issue, there are some features in [to-do](#to-do) that can be extended. I'm glad to see more people involved in improving and optimizing it.
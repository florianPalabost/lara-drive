---

kanban-plugin: board

---

## TODO

- [ ] #refactor  create api folder ?
- [ ] #bug (folder) no toast when successfully adding/editing folder
- [ ] #bug cannot add another root folder after navigating in folders
- [ ] #bug cannot see search pages
- [ ] (front) context menu: add clic droit panel actions (add folder, add file, ...)
- [ ] #low (front) add switch layout liste ou grille
- [ ] tagging files
- [ ] (files) drag & drop file
- [ ] dashboard: show total files, recent upload files, ...
- [ ] (folder) download folder as zip/7z
- [ ] (files) filter search files
- [ ] (files) qrcode of share link
- [ ] (files) throttle file upload : https://laravel.com/docs/12.x/routing#attaching-rate-limiters-to-routes
- [ ] #bug dark mode folder & files
- [ ] rename file
- [ ] shorten urls for sharing file
- [ ] #bug size folder content with data table too large in medium size
- [ ] limit filename length in data table
- [ ] activity log
- [ ] #bug after delete/restore bulk no refresh of data table ?


## WIP

- [ ] #bug  (files) redirect wrong after login with share link
- [ ] file permissions


## DONE

- [ ] #refactor move controller in entity folder
- [ ] #refactor move actions in dedicated resource folder
- [ ] allow permanent delete file
- [ ] file list : bulk delete files
- [ ] restore file
- [ ] (files) soft delete file (moved to trash bin)
- [ ] #bug cannot delete file
- [ ] handle front pagination of files in data table
- [ ] #refactor breadcrumb service abstract
- [ ] upload multiple files
- [ ] #refactor use action to create folder
- [ ] (folder) breadcrumbs  with folder path
- [ ] #bug folder path is not well recorded
- [ ] move files
- [ ] create datatable component
- [ ] versioning; download selected file version
- [ ] versioning: see selected version files
- [ ] (files) simple versioning files
- [ ] file share
- [ ] (files) limit file upload to 100 mo (default setting in php ini)
- [ ] (files) search files
- [ ] (files/ui) add different icon files
- [ ] (folder) Implem edit folder
- [ ] (folder) Implem delete folder
- [ ] (files) file size in custom hook
- [ ] (files) PDF/image preview in a modal/lightbox
- [ ] (files) preview file
- [ ] add toast
- [ ] (folder) import folder
- [ ] (files) implem delete file
- [ ] (files) add recent files page
- [ ] #back (files) Implem File service (upload, download)

	blocked_by: [[_Kanban/Lara-drive#^b5uoes]]
- [ ] #back (files) Implem CustomFile CRUD ^b5uoes
- [ ] #bug need to reload after upload a file in folder
- [ ] #bug (bug) adding a file  to subfolder add it to root folder
- [ ] #back (files) Setup minio docker service
	 '+' config filesystem
- [ ] #back Benchmark nested strategy choices:
	(adj list, nested set, materialized path)

	=> materialized path
- [ ] #back Implem CRUD folder
- [ ] #back Setup folder migrations
- [ ] #front Implem create Folder page
- [ ] #front Implem index folders page + components (FolderTree & FolderContent)
- [ ] #front Setup react arborist for tree
- [ ] Setup project


## BLOCKED





%% kanban:settings
```
{"kanban-plugin":"board","list-collapse":[false,false,false,false],"move-tags":true}
```
%%

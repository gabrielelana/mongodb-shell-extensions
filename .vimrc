" autoload the local .vimrc file you need to have
" https://github.com/MarcWeber/vim-addon-local-vimrc
" plugin installed

let g:ctrlp_custom_ignore = '\.git$\|\.tmp$\|node_modules$\|bower_components$'

let g:syntastic_mode_map = {'mode': 'passive', 'active_filetypes': ['javascript']}
let g:syntastic_javascript_jshint_args = '-c .jshintrc'
let g:syntastic_check_on_open = 1

nnoremap <Leader>t :!mocha --recursive --reporter spec --colors test/<CR>
nnoremap <Leader>f :!mocha --reporter spec --colors %<CR>

<?php
// boot.php
if (rex::isBackend() && rex::getUser()) {
    rex_extension::register(
        'SLICE_SHOW', 
        ['rex_slice_extension', 'handleSliceShow']
    );
    
    if (rex_be_controller::getCurrentPage() == 'content/edit') {
        rex_view::addCssFile($this->getAssetsUrl('css/slice-ops.css'));
        rex_view::addJsFile($this->getAssetsUrl('dist/slice-ops.js'));
    }
}

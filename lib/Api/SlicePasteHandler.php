<?php 
// lib/Api/SlicePasteHandler.php
class rex_api_slice_paste extends rex_api_function
{
    protected $published = true;

    public function execute()
    {
        $targetId = rex_request('target_id', 'int');
        $position = rex_request('position', 'string', 'after');
        
        $service = new rex_slice_operations();
        
        return new rex_api_result(
            true,
            $service->pasteSlice($targetId, $position)
        );
    }
}

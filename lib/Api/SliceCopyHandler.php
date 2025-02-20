<?php
// lib/Api/SliceCopyHandler.php
class rex_api_slice_copy extends rex_api_function
{
    protected $published = true;

    public function execute()
    {
        $sliceId = rex_request('slice_id', 'int');
        $service = new rex_slice_operations();
        
        return new rex_api_result(
            true,
            $service->copySlice($sliceId)
        );
    }
}

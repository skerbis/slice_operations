// lib/Service/SliceOperations.php
class rex_slice_operations 
{
    private rex_slice_operations_provider $provider;
    
    public function __construct() 
    {
        $this->provider = new rex_slice_operations_provider();
    }

    public function copySlice(int $sliceId): array
    {
        try {
            if (!rex::getUser()->hasPerm('copySlice[]')) {
                throw new rex_exception('No permission to copy slices');
            }

            $slice = rex_article_slice::getArticleSliceById($sliceId);
            if (!$slice) {
                throw new rex_exception('Slice not found');
            }

            // Extension Point BEFORE
            rex_extension::registerPoint(new rex_extension_point(
                'SLICE_COPY_BEFORE',
                '',
                ['slice_id' => $sliceId]
            ));

            $copiedData = $this->provider->copySliceToClipboard($slice);

            // Extension Point AFTER
            rex_extension::registerPoint(new rex_extension_point(
                'SLICE_COPY_AFTER',
                '',
                ['slice_id' => $sliceId, 'copied_data' => $copiedData]
            ));

            return [
                'success' => true,
                'message' => rex_i18n::msg('slice_copied')
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    public function pasteSlice(int $targetId, string $position = 'after'): array
    {
        try {
            if (!rex::getUser()->hasPerm('pasteSlice[]')) {
                throw new rex_exception('No permission to paste slices');
            }

            $clipboardData = $this->provider->getClipboardData();
            if (!$clipboardData) {
                throw new rex_exception('No slice in clipboard');
            }

            // Extension Point BEFORE
            rex_extension::registerPoint(new rex_extension_point(
                'SLICE_PASTE_BEFORE',
                '',
                [
                    'target_id' => $targetId,
                    'position' => $position,
                    'clipboard_data' => $clipboardData
                ]
            ));

            $newSliceId = $this->provider->pasteSlice($targetId, $position, $clipboardData);

            // Extension Point AFTER
            rex_extension::registerPoint(new rex_extension_point(
                'SLICE_PASTE_AFTER',
                '',
                [
                    'new_slice_id' => $newSliceId,
                    'target_id' => $targetId,
                    'position' => $position
                ]
            ));

            rex_article_cache::delete($clipboardData['article_id']);

            return [
                'success' => true,
                'message' => rex_i18n::msg('slice_pasted'),
                'slice_id' => $newSliceId
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}

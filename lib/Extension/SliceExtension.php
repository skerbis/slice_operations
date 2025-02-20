<?php
// lib/Extension/SliceExtension.php
class rex_slice_extension
{
    public static function handleSliceShow(rex_extension_point $ep): string
    {
        if (!rex::getUser()->hasPerm('copySlice[]')) {
            return $ep->getSubject();
        }

        $slice = $ep->getParams()['slice'];
        $subject = $ep->getSubject();

        // Buttons einfügen
        $buttons = self::getOperationButtons($slice);
        
        // Füge Buttons in das Slice ein
        return str_replace(
            '</header>',
            $buttons . '</header>',
            $subject
        );
    }

    private static function getOperationButtons(rex_article_slice $slice): string
    {
        return sprintf(
            '<div class="slice-operations">
                <button class="btn btn-default" 
                        data-slice-copy="%d" 
                        title="%s">
                    <i class="fa-regular fa-copy"></i>
                </button>
                <button class="btn btn-default" 
                        data-slice-paste="%d" 
                        data-paste-position="after"
                        title="%s">
                    <i class="fa-solid fa-paste"></i>
                </button>
            </div>',
            $slice->getId(),
            rex_i18n::msg('slice_copy'),
            $slice->getId(),
            rex_i18n::msg('slice_paste')
        );
    }
}

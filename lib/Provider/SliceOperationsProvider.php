// lib/Provider/SliceOperationsProvider.php
class rex_slice_operations_provider 
{
    private rex_slice_clipboard_session $session;

    public function __construct()
    {
        $this->session = new rex_slice_clipboard_session();
    }

    public function copySliceToClipboard(rex_article_slice $slice): array
    {
        $data = [
            'id' => $slice->getId(),
            'article_id' => $slice->getArticleId(),
            'clang' => $slice->getClang(),
            'ctype' => $slice->getCtype(),
            'module_id' => $slice->getModuleId(),
            'values' => $this->getSliceValues($slice)
        ];

        $this->session->setSlice($data);
        return $data;
    }

    private function getSliceValues(rex_article_slice $slice): array
    {
        $values = [];
        for ($i = 1; $i <= 20; $i++) {
            $values['value' . $i] = $slice->getValue($i);
            $values['media' . $i] = $slice->getMedia($i);
            $values['medialist' . $i] = $slice->getMedialist($i);
            $values['link' . $i] = $slice->getLink($i);
            $values['linklist' . $i] = $slice->getLinklist($i);
        }
        return $values;
    }
}

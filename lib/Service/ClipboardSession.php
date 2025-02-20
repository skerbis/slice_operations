<?php
// lib/Service/ClipboardSession.php
class rex_slice_clipboard_session
{
    private const SESSION_KEY = 'slice_clipboard';

    public function setSlice(array $data): void
    {
        $timeout = rex_addon::get('slice_operations')->getConfig('clipboard_timeout', 3600);
        $data['timestamp'] = time();
        rex_set_session(self::SESSION_KEY, $data);
    }

    public function getSlice(): ?array
    {
        $data = rex_session(self::SESSION_KEY, 'array', null);
        if ($data === null) {
            return null;
        }

        $timeout = rex_addon::get('slice_operations')->getConfig('clipboard_timeout', 3600);
        if (time() - $data['timestamp'] > $timeout) {
            $this->clear();
            return null;
        }

        return $data;
    }

    public function clear(): void
    {
        rex_unset_session(self::SESSION_KEY);
    }
}

import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

class SliceOperations {
    constructor() {
        this.init();
    }

    init() {
        this.initCopyPaste();
    }

    initCopyPaste() {
        document.addEventListener('click', (e) => {
            const copyBtn = e.target.closest('[data-slice-copy]');
            const pasteBtn = e.target.closest('[data-slice-paste]');
            
            if (copyBtn) {
                e.preventDefault();
                this.handleCopy(copyBtn);
            }
            
            if (pasteBtn) {
                e.preventDefault();
                this.handlePaste(pasteBtn);
            }
        });
    }

    async handleCopy(btn) {
        const sliceId = btn.dataset.sliceId;
        
        try {
            const response = await this.apiCall('slice_copy', {
                slice_id: sliceId
            });

            if (response.success) {
                this.showNotification('success', response.message);
                this.updateCopyIndicator(sliceId, true);
            } else {
                throw new Error(response.message);
            }
            
        } catch (error) {
            this.showNotification('error', error.message);
        }
    }

    async handlePaste(btn) {
        const targetId = btn.dataset.sliceId;
        const position = btn.dataset.pastePosition || 'after';
        
        try {
            const response = await this.apiCall('slice_paste', {
                target_id: targetId,
                position: position
            });

            if (response.success) {
                this.showNotification('success', response.message);
                this.refreshSlice(response.slice_id);
            } else {
                throw new Error(response.message);
            }
            
        } catch (error) {
            this.showNotification('error', error.message);
        }
    }

    async apiCall(func, params = {}) {
        const searchParams = new URLSearchParams({
            'rex-api-call': func,
            ...params,
            _csrf_token: this.getCsrfToken()
        });

        const response = await fetch('index.php?' + searchParams.toString(), {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        return await response.json();
    }

    showNotification(type, message) {
        const backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
        
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor,
            className: "rex-slice-notification",
        }).showToast();
    }

    updateCopyIndicator(sliceId, isCopied) {
        const btn = document.querySelector(`[data-slice-copy="${sliceId}"]`);
        if (btn) {
            btn.classList.toggle('is-copied', isCopied);
            // Update icon
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = isCopied ? 'fa-regular fa-clone' : 'fa-regular fa-copy';
            }
        }
    }

    refreshSlice(sliceId) {
        // PJAX reload der Seite
        const url = window.location.href;
        $.pjax({
            url: url,
            container: '#rex-js-page-main-content',
            fragment: '#rex-js-page-main-content'
        });
    }

    getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]')?.content;
    }
}

// Initialize
new SliceOperations();

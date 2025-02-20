// assets/js/main.js
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

class SliceOperations {
    constructor() {
        this.copyListeners = new Set();
        this.pasteListeners = new Set();
    }

    init() {
        this.initCopyPaste();
    }

    initCopyPaste() {
        // Cleanup old listeners
        this.removeListeners();
        
        // Add new listeners
        const copyButtons = document.querySelectorAll('[data-slice-copy]');
        const pasteButtons = document.querySelectorAll('[data-slice-paste]');

        copyButtons.forEach(btn => {
            const listener = (e) => {
                e.preventDefault();
                this.handleCopy(btn);
            };
            btn.addEventListener('click', listener);
            this.copyListeners.add({ element: btn, listener });
        });

        pasteButtons.forEach(btn => {
            const listener = (e) => {
                e.preventDefault();
                this.handlePaste(btn);
            };
            btn.addEventListener('click', listener);
            this.pasteListeners.add({ element: btn, listener });
        });
    }

    removeListeners() {
        this.copyListeners.forEach(({element, listener}) => {
            element.removeEventListener('click', listener);
        });
        this.pasteListeners.forEach(({element, listener}) => {
            element.removeEventListener('click', listener);
        });
        this.copyListeners.clear();
        this.pasteListeners.clear();
    }

    async handleCopy(btn) {
        const sliceId = btn.dataset.sliceCopy;
        
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
        const targetId = btn.dataset.slicePaste;
        const position = btn.dataset.pastePosition || 'after';
        
        try {
            const response = await this.apiCall('slice_paste', {
                target_id: targetId,
                position: position
            });

            if (response.success) {
                this.showNotification('success', response.message);
                this.refreshPage();
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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

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
            stopOnFocus: true
        }).showToast();
    }

    updateCopyIndicator(sliceId, isCopied) {
        const btn = document.querySelector(`[data-slice-copy="${sliceId}"]`);
        if (btn) {
            btn.classList.toggle('is-copied', isCopied);
            
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = isCopied ? 'fa-regular fa-clone' : 'fa-regular fa-copy';
            }
        }
    }

    refreshPage() {
        // PJAX reload über REDAXO API
        if (window.rex && window.rex.pjax) {
            window.rex.pjax.reload();
        } else {
            window.location.reload();
        }
    }

    getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]')?.content;
    }
}

// Initialization using jQuery for REDAXO events
$(document).on('rex:ready', () => {
    window.rex = window.rex || {};
    window.rex.sliceOps = new SliceOperations();
    window.rex.sliceOps.init();
});

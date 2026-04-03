/* ============================================
   CLOUDINARY INTEGRATION MODULE
   Handles all Cloudinary upload and fetch logic
   ============================================ */

const CloudinaryConfig = {
    cloudName: 'dnsyvxggn',
    uploadPreset: 'birthday-wife',
    folder: 'birthday-wife',
    tag: 'birthday-gallery',
    
    get uploadUrl() {
        return `https://api.cloudinary.com/v1_1/${this.cloudName}/auto/upload`;
    },
    
    getImageUrl(publicId, transforms = '') {
        const t = transforms || 'q_auto,f_auto,w_600';
        return `https://res.cloudinary.com/${this.cloudName}/image/upload/${t}/${publicId}`;
    },
    
    getVideoUrl(publicId, transforms = '') {
        const t = transforms || 'q_auto,f_auto,w_800';
        return `https://res.cloudinary.com/${this.cloudName}/video/upload/${t}/${publicId}`;
    },

    getThumbnailUrl(publicId, type = 'image') {
        if (type === 'video') {
            return `https://res.cloudinary.com/${this.cloudName}/video/upload/q_auto,f_jpg,w_400,h_400,c_fill,so_1/${publicId}`;
        }
        return `https://res.cloudinary.com/${this.cloudName}/image/upload/q_auto,f_auto,w_400,h_400,c_fill/${publicId}`;
    },

    getFullUrl(publicId, type = 'image') {
        if (type === 'video') {
            return `https://res.cloudinary.com/${this.cloudName}/video/upload/q_auto/${publicId}`;
        }
        return `https://res.cloudinary.com/${this.cloudName}/image/upload/q_auto,f_auto/${publicId}`;
    }
};

/* Upload a file to Cloudinary */
async function uploadToCloudinary(file, onProgress) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CloudinaryConfig.uploadPreset);
    formData.append('folder', CloudinaryConfig.folder);
    formData.append('tags', CloudinaryConfig.tag);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', CloudinaryConfig.uploadUrl, true);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                const percent = Math.round((e.loaded / e.total) * 100);
                onProgress(percent);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(formData);
    });
}

/* Fetch all media from Cloudinary by tag */
async function fetchGalleryMedia() {
    try {
        // Use client-side resource list API
        const url = `https://res.cloudinary.com/${CloudinaryConfig.cloudName}/image/list/${CloudinaryConfig.tag}.json`;
        const response = await fetch(url);
        
        if (!response.ok) {
            console.log('No gallery data found yet (this is normal for new setups)');
            return [];
        }
        
        const data = await response.json();
        const resources = data.resources || [];
        
        return resources.map(r => ({
            publicId: r.public_id,
            type: r.resource_type || (r.format && ['mp4', 'webm', 'mov', 'avi'].includes(r.format.toLowerCase()) ? 'video' : 'image'),
            format: r.format,
            width: r.width,
            height: r.height,
            created: r.created_at,
            url: r.resource_type === 'video' 
                ? CloudinaryConfig.getFullUrl(r.public_id, 'video')
                : CloudinaryConfig.getFullUrl(r.public_id, 'image'),
            thumbnail: r.resource_type === 'video'
                ? CloudinaryConfig.getThumbnailUrl(r.public_id, 'video')
                : CloudinaryConfig.getThumbnailUrl(r.public_id, 'image')
        }));
    } catch (err) {
        console.log('Gallery fetch info:', err.message);
        return [];
    }
}

/* Fetch videos separately */
async function fetchVideoMedia() {
    try {
        const url = `https://res.cloudinary.com/${CloudinaryConfig.cloudName}/video/list/${CloudinaryConfig.tag}.json`;
        const response = await fetch(url);
        
        if (!response.ok) return [];
        
        const data = await response.json();
        const resources = data.resources || [];
        
        return resources.map(r => ({
            publicId: r.public_id,
            type: 'video',
            format: r.format,
            width: r.width,
            height: r.height,
            created: r.created_at,
            url: CloudinaryConfig.getFullUrl(r.public_id, 'video'),
            thumbnail: CloudinaryConfig.getThumbnailUrl(r.public_id, 'video')
        }));
    } catch (err) {
        console.log('Video fetch info:', err.message);
        return [];
    }
}

/* Delete from Cloudinary (requires API key - only works from admin with backend) */
async function deleteFromCloudinary(publicId) {
    // Note: Deletion from client-side is not possible with unsigned presets
    // This is a placeholder — you'd need a serverless function for actual deletion
    console.warn('Client-side deletion is not supported. Remove from Cloudinary dashboard.');
    return false;
}

// Make available globally
window.CloudinaryConfig = CloudinaryConfig;
window.uploadToCloudinary = uploadToCloudinary;
window.fetchGalleryMedia = fetchGalleryMedia;
window.fetchVideoMedia = fetchVideoMedia;

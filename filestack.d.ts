declare namespace filestack {

    export interface Security {
        policy: string;
        signature: string;
    }

    export interface ClientOptions {
        [option: string]: any;
        /**
         * Security object with policy and signature keys.
         * Can be used to limit client capabilities and protect public URLs.
         * It is intended to be used with server-side policy and signature generation.
         * Read about [security policies](https://www.filestack.com/docs/concepts/security).
         */
        security ? : Security;
        /**
         * Domain to use for all URLs. __Requires the custom CNAME addon__.
         * If this is enabled then you must also set up your own OAuth applications
         * for each cloud source you wish to use in the picker.
         */
        cname ? : string;
        /**
         * Enable/disable caching of the cloud session token. Default is false.
         * This ensures that users will be remembered on your domain when calling the cloud API from the browser.
         * Please be aware that tokens stored in localStorage are accessible by other scripts on the same domain.
         */
        sessionCache ? : boolean;
    }

    export interface PickerInstance {
        /**
         * Close picker. This operation is idempotent.
         */
        close: () => Promise < void > ;

        /**
         * Cancel picker uploads. This operation is idempotent.
         */
        cancel: () => Promise < void > ;

        /**
         * Open picker. This operation is idempotent.
         */
        open: () => Promise < void > ;

        /**
         * Specify a list of files to open in the picker for cropping
         *
         * ### Example
         *
         * ```js
         * // <input id="fileSelect" type="file">
         *
         * const inputEl = document.getElementById('fileSelect');
         * const picker = client.picker({
         *   onUploadDone: res => console.log(res),
         * });
         *
         * inputEl.addEventListener('change', (e) => {
         *   picker.crop(e.target.files);
         * });
         *
         * // Or pass an array of URL strings
         * const urls = [
         *   'https://d1wtqaffaaj63z.cloudfront.net/images/fox_in_forest1.jpg',
         *   'https://d1wtqaffaaj63z.cloudfront.net/images/sail.jpg',
         * ];
         * picker.crop(urls);
         * ```
         */
        crop: (files: any[]) => Promise < void > ;
    }

    export interface PickerCroppedData {
        cropArea: {
            /**
             * [x, y]
             */
            position: [number, number];
            /**
             * [width, height]
             */
            size: [number, number];
        };
        /**
         * [width, height]
         */
        originalImageSize: [number, number];
    }

    export enum RotateDirection {
        cw,
        ccw
    }

    export interface PickerRotatedData {
        /**
         * Amount rotated in degrees.
         */
        value: number;
        /**
         * Can be CW or CCW (clockwise / counter-clockwise)
         */
        direction: RotateDirection;
    }

    export interface FSProgressEvent {
        totalPercent: number;
        totalBytes: number;
    }

    export interface PickerFileMetadata {
        /**
         * The cloud container for the uploaded file.
         */
        container ? : string;
        /**
         * Position and size information for cropped images.
         */
        cropped ? : PickerCroppedData;
        /**
         * Name of the file.
         */
        filename: string;
        /**
         * Filestack handle for the uploaded file.
         */
        handle: string;
        /**
         * The hash-prefixed cloud storage path.
         */
        key ? : string;
        /**
         * The MIME type of the file.
         */
        mimetype: string;
        /**
         * Properties of the local binary file. Also see the pick option `exposeOriginalFile` if you want the underlying `File` object.
         */
        originalFile ? : object | File;
        /**
         * The origin of the file, e.g. /Folder/file.jpg.
         */
        originalPath: string;
        /**
         * Direction and value information for rotated images.
         */
        rotated ? : PickerRotatedData;
        /**
         * Size in bytes of the uploaded file.
         */
        size: number;
        /**
         * The source from where the file was picked.
         */
        source: string;
        /**
         * Indicates Filestack transit status.
         */
        status ? : string;
        /**
         * A uuid for tracking this file in callbacks.
         */
        uploadId: string;
        /**
         * The Filestack CDN URL for the uploaded file.
         */
        url: string;
    }

    export interface PickerResponse {
        filesUploaded: PickerFileMetadata[];
        filesFailed: PickerFileMetadata[];
    }

    export interface PickerFileCallback {
        (file: PickerFileMetadata): void | Promise < any > ;
    }

    export interface PickerFileErrorCallback {
        (file: PickerFileMetadata, error: Error): void;
    }

    export interface PickerFileProgressCallback {
        (file: PickerFileMetadata, event: FSProgressEvent): void;
    }

    export interface PickerUploadStartedCallback {
        (files: PickerFileMetadata[]): void;
    }

    export interface PickerUploadDoneCallback {
        (files: PickerResponse): void;
    }

    export enum PickerDisplayMode {
        inline,
        overlay,
        dropPane
    }

    export interface PickerDropPaneOptions {
        /**
         * Toggle the crop UI for dropped files.
         */
        cropFiles ? : boolean;
        /**
         * Customize the text content in the drop pane.
         */
        customText ? : string;
        /**
         * Disable the file input on click. This does not disable the `onClick` callback.
         */
        disableClick ? : boolean;
        /**
         * Toggle the full-page drop zone overlay.
         */
        overlay ? : boolean;
        onDragEnter ? : (evt: DragEvent) => void;
        onDragLeave ? : () => void;
        onDragOver ? : (evt: DragEvent) => void;
        onDrop ? : (evt: DragEvent) => void;
        /**
         * `onSuccess` must be used instead of `onUploadDone`. The drop pane uses its own callbacks for compatibility purposes. This might eventually change.
         */
        onSuccess ? : (files: PickerFileMetadata[]) => void;
        onError ? : (files: PickerFileMetadata[]) => void;
        onProgress ? : (percent: number) => void;
        onClick ? : (evt: any) => void;
        /**
         * Toggle icon element in drop pane.
         */
        showIcon ? : boolean;
        /**
         * Toggle upload progress display.
         */
        showProgress ? : boolean;
    }

    export interface PickerStoreOptions {
        /**
         * Location for stored file. One of 's3', 'gcs', 'azure', 'rackspace', or 'dropbox'.
         */
        location ? : string;
        /**
         * Specify storage container.
         */
        container ? : string;
        /**
         * Set container path. Indicate a folder by adding a trailing slash. Without a trailing slash all files will be stored to the same object.
         */
        path ? : string;
        /**
         * Specify S3 region.
         */
        region ? : string;
        /**
         * S3 container access. 'public' or 'private'.
         */
        access ? : string;
    }

    export interface PickerCustomText {
        // Actions
        Upload: string;
        'Deselect All': string;
        'View/Edit Selected': string;
        'Sign Out': string;

        // Source Labels
        'My Device': string;
        'Web Search': string;
        'Take Photo': string;
        'Link (URL)': string;
        'Record Video': string;
        'Record Audio': string;

        // Custom Source
        'Custom Source': string;

        // Footer Text
        Add: string;
        'more file': string;
        'more files': string;

        // Cloud
        Connect: string;
        'Select Files from': string;
        'You need to authenticate with ': string;
        'A new page will open to connect your account.': string;
        'We only extract images and never modify or delete them.': string;

        // Summary
        Files: string;
        Images: string;
        Uploaded: string;
        Uploading: string;
        Completed: string;
        Filter: string;
        'Cropped Images': string;
        'Edited Images': string;
        'Selected Files': string;
        'Crop is required on images': string;

        // Transform
        Crop: string;
        Circle: string;
        Rotate: string;
        Mask: string;
        Revert: string;
        Edit: string;
        Reset: string;
        Done: string;
        Save: string;
        Next: string;
        'Edit Image': string;
        'This image cannot be edited': string;

        // Retry messaging
        'Connection Lost': string;
        'Failed While Uploading': string;
        'Retrying in': string;
        'Try again': string;
        'Try now': string;

        // Local File Source
        'or Drag and Drop, Copy and Paste Files': string;
        'Select Files to Upload': string;
        'Select From': string;
        'Drop your files anywhere': string;

        // Input placeholders
        'Enter a URL': string;
        'Search images': string;

        // Webcam Source
        'Webcam Disabled': string;
        'Webcam Not Supported': string;
        'Please enable your webcam to take a photo.': string;
        'Your current browser does not support webcam functionality.': string;
        'We suggest using Chrome or Firefox.': string;

        // Error Notifications
        'File {displayName} is not an accepted file type. The accepted file types are {types}': string;
        'File {displayName} is too big. The accepted file size is less than {roundFileSize}': string;
        'Our file upload limit is {maxFiles} {filesText}': string;
    }

    export interface UploadOptions {
        host ? : string;
        /**
         * Node only. Treat the file argument as a path string.
         */
        path ? : boolean;
        /**
         * Set the MIME type of the uploaded file.
         */
        mimetype ? : string;
        /**
         * Maximum size for file slices. Is overridden when intelligent=true. Default is `6 * 1024 * 1024` (6MB).
         */
        partSize ? : number;
        /**
         * Maximum amount of part jobs to run concurrently. Default is 3.
         */
        concurrency ? : number;
        /**
         * Callback for progress events.
         */
        onProgress ? : (evt: FSProgressEvent) => void;
        /**
         * How often to report progress. Default is 1000 (in milliseconds).
         */
        progressInterval ? : number;
        /**
         * Callback for retry events.
         */
        onRetry ? : (evt: FSRetryEvent) => void;
        /**
         * Retry limit. Default is 10.
         */
        retry ? : number; // Retry limit
        /**
         * Factor for exponential backoff on server errors. Default is 2.
         */
        retryFactor ? : number;
        /**
         * Upper bound for exponential backoff. Default is 15000.
         */
        retryMaxTime ? : number;
        /**
         * Timeout for network requests. Default is 120000.
         */
        timeout ? : number;
        /**
         * Enable/disable intelligent ingestion.
         * If truthy then intelligent ingestion must be enabled in your Filestack application.
         * Passing true/false toggles the global intelligent flow (all parts are chunked and committed).
         * Passing `'fallback'` will only use FII when network conditions may require it (only failing parts will be chunked).
         */
        intelligent ? : boolean | string;
        /**
         * Set the default intiial chunk size for Intelligent Ingestion. Defaults to 8MB on desktop and 1MB on mobile.
         */
        intelligentChunkSize ? : number;
    }

    export interface FSRetryEvent {
        location: string;
        parts: PartsMap;
        filename: string;
        attempt: number | undefined;
        chunkSize ? : number;
    }

    export interface PartsMap {
        [part: string]: PartObj;
    }

    export interface PartObj {
        buffer: any;
        chunks: any[];
        chunkSize: number;
        intelligentOverride: boolean;
        loaded: number;
        number: number;
        request: any;
        size: number;
        md5 ? : string;
        offset ? : number;
    }

    export interface PickerOptions {
        /**
         * Restrict file types that are allowed to be picked. Formats accepted:
         *  - .pdf <- any file extension
         *  - image/jpeg <- any mime type commonly known by browsers
         *  - image/* <- accept all types of images
         *  - video/* <- accept all types of video files
         *  - audio/* <- accept all types of audio files
         *  - application/* <- accept all types of application files
         *  - text/* <- accept all types of text files
         */
        accept ? : string | string[];
        /**
         * Prevent modal close on upload failure and allow users to retry.
         */
        allowManualRetry ? : boolean;
        /**
         *  Valid sources are:
         *  - local_file_system - Default
         *  - url - Default
         *  - imagesearch - Default
         *  - facebook - Default
         *  - instagram - Default
         *  - googledrive - Default
         *  - dropbox - Default
         *  - webcam - Uses device menu on mobile. Not currently supported in Safari and IE.
         *  - video - Uses device menu on mobile. Not currently supported in Safari and IE.
         *  - audio - Uses device menu on mobile. Not currently supported in Safari and IE.
         *  - box
         *  - github
         *  - gmail
         *  - picasa
         *  - onedrive
         *  - onedriveforbusiness
         *  - clouddrive
         *  - customsource - Configure this in your Filestack Dev Portal.
         */
        fromSources ? : string[];
        /**
         * Container where picker should be appended. Only relevant for `inline` and `dropPane` display modes.
         */
        container ? : string | Node;
        /**
         * Picker display mode, one of `'inline'`, `'overlay'`, `'dropPane'` - default is `'overlay'`.
         */
        displayMode ? : PickerDisplayMode;
        /**
         * Max number of files to upload concurrently. Default is 4.
         */
        concurrency ? : number;
        /**
         * Set the default container for your custom source.
         */
        customSourceContainer ? : string;
        /**
         * Set the default path for your custom source container.
         */
        customSourcePath ? : string;
        /**
         * Set the display name for the custom source.
         */
        customSourceName ? : string;
        /**
         * Provide an object for mapping picker strings to your own strings.
         * Strings surrounded by brackets, `{ foobar }`, are interpolated with runtime values.
         * Source labels are also available to override, e.g. Facebook, Instagram, Dropbox, etc.
         */
        customText ? : PickerCustomText;
        /**
         * When true removes the hash prefix on stored files.
         */
        disableStorageKey ? : boolean;
        /**
         * When true removes ability to edit images.
         */
        disableTransformer ? : boolean;
        /**
         * Disables local image thumbnail previews in the summary screen.
         */
        disableThumbnails ? : boolean;
        /**
         * Configure the drop pane behavior, i.e. when `displayMode` is `dropPane`.
         */
        dropPane: PickerDropPaneOptions;
        /**
         * When true the `originalFile` metadata will be the actual `File` object instead of a POJO
         */
        exposeOriginalFile ? : boolean;
        /**
         * Toggle the drop zone to be active on all views. Default is active only on local file source.
         */
        globalDropZone ? : boolean;
        /**
         * Hide the picker modal UI once uploading begins. Defaults to `false`.
         */
        hideModalWhenUploading ? : boolean;
        /**
         * Specify image dimensions. e.g. [800, 600]. Only for JPEG, PNG, and BMP files.
         * Local and cropped images will be resized (upscaled or downscaled) to the specified dimensions before uploading.
         * The original height to width ratio is maintained. To resize all images based on the width, set [width, null], e.g. [800, null].
         * For the height set [null, height], e.g. [null, 600].
         */
        imageDim ? : [number, number];
        /**
         * Specify maximum image dimensions. e.g. [800, 600]. Only for JPEG, PNG, and BMP files.
         * Images bigger than the specified dimensions will be resized to the maximum size while maintaining the original aspect ratio.
         * The output will not be exactly 800x600 unless the imageMax matches the aspect ratio of the original image.
         */
        imageMax ? : [number, number];
        /**
         * Specify minimum image dimensions. e.g. [800, 600]. Only for JPEG, PNG, and BMP files.
         * Images smaller than the specified dimensions will be upscaled to the minimum size while maintaining the original aspect ratio.
         * The output will not be exactly 800x600 unless the imageMin matches the aspect ratio of the original image.
         */
        imageMin ? : [number, number];
        /**
         * Sets locale. Accepts: ca, da, de, en, es, fr, he, it, ja, ko, nl, no, pl, pt, sv, ru, vi, zh.
         */
        lang ? : string;
        /**
         * Minimum number of files required to start uploading. Defaults to 1.
         */
        minFiles ? : number;
        /**
         * Maximum number of files allowed to upload. Defaults to 1.
         */
        maxFiles ? : number;
        /**
         * Restrict selected files to a maximum number of bytes. (e.g. 10 \* 1024 \* 1024 for 10MB limit).
         */
        maxSize ? : number;
        /**
         * Specify [width, height] in pixels of the desktop modal.
         */
        modalSize ? : [number, number];
        /**
         * Called when all uploads in a pick are cancelled.
         */
        onCancel ? : PickerUploadDoneCallback;
        /**
         * Called when the UI is exited.
         */
        onClose ? : () => void;
        /**
         * Called when the UI is mounted.
         * @param PickerInstance application handle
         */
        onOpen ? : (handle: PickerInstance) => void;
        /**
         * Called whenever user selects a file.
         * ### Example
         *
         * ```js
         * // Using to veto file selection
         * // If you throw any error in this function it will reject the file selection.
         * // The error message will be displayed to the user as an alert.
         * onFileSelected(file) {
         *   if (file.size > 1000 * 1000) {
         *     throw new Error('File too big, select something smaller than 1MB');
         *   }
         * }
         *
         * // Using to change selected file name
         * // NOTE: This currently only works for local uploads
         * onFileSelected(file) {
         *   // It's important to return a new file by the end of this function.
         *   return { ...file, name: 'foo' };
         * }
         * ```
         *
         * The callback function can also return a Promise to allow asynchronous validation logic.
         * You can pass a file object to `resolve` for changing the file name, it will behave the same as when
         * the file is returned from the non-async callback.
         *
         * ```js
         * onFileSelected(file) {
         *   return new Promise((resolve, reject) => {
         *     // Do something async
         *     resolve();
         *     // Or reject the selection with reject()
         *   });
         * }
         * ```
         */
        onFileSelected ? : PickerFileCallback;
        /**
         * Called when a file begins uploading.
         */
        onFileUploadStarted ? : PickerFileCallback;
        /**
         * Called when a file is done uploading.
         */
        onFileUploadFinished ? : PickerFileCallback;
        /**
         * Called when uploading a file fails.
         */
        onFileUploadFailed ? : PickerFileErrorCallback;
        /**
         * Called during multi-part upload progress events. Local files only.
         */
        onFileUploadProgress ? : PickerFileProgressCallback;
        /**
         * Called when uploading starts (user initiates uploading).
         */
        onUploadStarted ? : PickerUploadStartedCallback;
        /**
         * Called when all files have been uploaded.
         */
        onUploadDone ? : PickerUploadDoneCallback;
        /**
         * For cloud sources whether to link or store files. Defaults to `false`.
         */
        preferLinkOverStore ? : boolean;
        /**
         * Define a unique id for the application mount point.
         * May be useful for more advanced use cases.
         * For example, if you wish to have more than one picker instance open at once,
         * then each will need their own unique rootId.
         *
         * **Note:** This option is ignored when `displayMode` is `dropPane`.
         */
        rootId ? : string;
        /**
         * Whether to start uploading automatically when maxFiles is hit. Defaults to `false`.
         */
        startUploadingWhenMaxFilesReached ? : boolean;
        /**
         * Options for file storage.
         */
        storeTo ? : PickerStoreOptions;
        /**
         * Specify options for images passed to the crop UI.
         */
        transformations ? : PickerTransformationOptions;
        /**
         * Options for local file uploads.
         */
        uploadConfig ? : UploadOptions;
        /**
         * Start uploading immediately on file selection. Defaults to `true`.
         */
        uploadInBackground ? : boolean;
        /**
         * Sets the resolution of recorded video. One of "320x240", "640x480" or "1280x720". Default is `"640x480"`.
         */
        videoResolution ? : string;
    }

    export interface PickerCropOptions {
        /**
         * Maintain aspect ratio for crop selection. (e.g. 16/9, 800/600).
         */
        aspectRatio ? : number;
        /**
         * Force all images to be cropped before uploading.
         */
        force ? : boolean;
    }

    export interface PickerTransformationOptions {
        /**
         * Enable crop. Defaults to `true`.
         */
        crop ? : boolean | PickerCropOptions;
        /**
         * Enable circle crop. Disabled if crop.aspectRatio is defined and not 1. Converts to PNG. Defaults to `true`.
         */
        circle ? : boolean;
        /**
         * Enable image rotation. Defaults to `true`.
         */
        rotate ? : boolean;
    }

    export interface MetadataOptions {
        size ? : boolean;
        mimetype ? : boolean;
        filename ? : boolean;
        width ? : boolean;
        height ? : boolean;
        uploaded ? : boolean;
        writeable ? : boolean;
        cloud ? : boolean;
        sourceUrl ? : boolean;
        md5 ? : boolean;
        sha1 ? : boolean;
        sha224 ? : boolean;
        sha256 ? : boolean;
        sha384 ? : boolean;
        sha512 ? : boolean;
        location ? : boolean;
        path ? : boolean;
        container ? : boolean;
        exif ? : boolean;
    }

    export interface PreviewOptions {
        /**
         * Id for DOM element to embed preview into.
         * Omit this to open the preview in a new tab
         */
        id: string;
        /**
         * URL to custom CSS
         */
        css ? : string;
    }

    export interface RetrieveOptions {
        metadata ? : boolean;
        head ? : boolean;
        dl ? : boolean;
        extension ? : string;
        cache ? : boolean;
    }

    export interface StoreOptions {
        /**
         * Filename for stored file
         */
        filename ? : string;
        /**
         * Location for stored file. One of 's3', 'gcs', 'azure', 'rackspace', or 'dropbox'.
         */
        location ? : string;
        /**
         * Set container path.
         */
        path ? : string;
        /**
         * Specify S3 region.
         */
        region ? : string;
        /**
         * Specify storage container.
         */
        container ? : string;
        /**
         * S3 container access. 'public' or 'private'.
         */
        access ? : string;
    }

    export enum EAlignOptions {
        left,
        right,
        center,
        bottom,
        top
    }

    /**
     * Align enum with faces option
     */
    export enum EAlignFacesOptions {
        left,
        right,
        center,
        bottom,
        top,
        faces
    }

    /**
     * Fit enum
     */
    export enum EFitOptions {
        clip,
        crop,
        scale,
        max
    }

    /**
     * Blur enum
     */
    export enum EBlurMode {
        linear,
        gaussian
    }

    /**
     * Shapes enum
     */
    export enum EShapeType {
        oval,
        rect
    }

    /**
     * Noise type enum
     */
    export enum ENoiseType {
        none,
        low,
        medium,
        high
    }

    /**
     * Style type enum
     */
    export enum EStyleType {
        artwork,
        photo
    }

    /**
     * Color space enum
     */
    export enum EColorspaceType {
        RGB,
        CMYK,
        Input
    }

    /**
     * Crop faces options enum
     */
    export enum ECropfacesType {
        thumb,
        crop,
        fill
    }

    /**
     * Convert to format
     */
    export enum EVideoTypes {
        h264,
        h264_hi,
        webm,
        'webm-hi',
        ogg,
        'ogg-hi',
        'hls-variant',
        mp3,
        oga,
        m4a,
        aac,
        hls
    }

    /**
     * Video storage location
     */
    export enum EVideoLocations {
        s3,
        azure,
        gcs,
        rackspace,
        dropbox
    }

    export enum EVideoAccess {
        private,
        public
    }

    export enum EVideoAccessMode {
        preserve,
        constrain,
        letterbox,
        pad,
        crop,
    }

    export interface TransformOptions {
        flip ? : boolean;
        compress ? : boolean;
        flop ? : boolean;
        enchance ? : boolean;
        redeye ? : boolean;
        monochrome ? : boolean;
        negative ? : boolean;
        tags ? : boolean;
        sfw ? : boolean;
        resize ? : {
            width ? : number;
            height ? : number;
            fit ? : boolean;
            align ? : EAlignFacesOptions;
        };
        crop ? : {
            dim: [number, number, number, number]
        };
        rotate ? : {
            deg: number | string;
            color ? : string;
            background ? : string;
        };
        detect_faces ? : {
            minsize ? : number;
            maxsize ? : number;
            color ? : string;
            export ? : boolean;
        } | true;
        crop_faces ? : {
            mode ? : ECropfacesType;
            width ? : number;
            height ? : number;
            faces ? : number | string;
            buffer ? : number;
        };
        pixelate_faces ? : {
            faces ? : number | string;
            minsize ? : number;
            maxsize ? : number;
            buffer ? : number;
            amount ? : number;
            blur ? : number;
            type ? : EShapeType;
        };
        blur_faces ? : {
            faces ? : number | string;
            minsize ? : number;
            maxsize ? : number;
            buffer ? : number;
            amount ? : number;
            blur ? : number;
            type ? : EShapeType;
        };
        rounded_corners ? : {
            radius ? : number;
            blur ? : number;
            background ? : string;
        } | true;
        vignette ? : {
            amount ? : number;
            blurmode ? : EBlurMode;
            background ? : string;
        };
        polaroid ? : {
            color ? : string;
            rotate ? : number;
            background ? : string;
        } | true;
        torn_edges ? : {
            spread ? : [number, number];
            background ? : string;
        } | true;
        shadow ? : {
            blur ? : number;
            opacity ? : number;
            vector ? : [number, number];
            color ? : string;
            background ? : string;
        } | true;
        circle ? : {
            background ? : string;
        } | true;
        border ? : {
            width ? : number;
            color ? : string;
            background ? : string;
        } | true;
        sharpen ? : {
            amount: number;
        } | true;
        blur ? : {
            amount: number;
        } | true;
        blackwhite ? : {
            threshold: number;
        } | true;
        sepia ? : {
            tone: number;
        } | true;
        pixelate ? : {
            amount: number;
        } | true;
        oil_paint ? : {
            amount: number;
        } | true;
        modulate ? : {
            brightness ? : number;
            hue ? : number;
            saturation ? : number;
        } | true;
        partial_pixelate ? : {
            amount ? : number;
            blur ? : number;
            type ? : EShapeType;
            objects ? : [
                [number, number, number, number]
            ];
        };
        partial_blur ? : {
            amount: number;
            blur ? : number;
            type ? : EShapeType;
            objects ? : [
                [number, number, number, number]
            ];
        };
        collage ? : {
            margin ? : number;
            width ? : number;
            height ? : number;
            color ? : string;
            fit ? : EFitOptions,
            files: [string];
        };
        upscale ? : {
            upscale ? : boolean;
            noise ? : ENoiseType;
            style ? : EStyleType;
        } | true;
        ascii ? : {
            background ? : string;
            foreground ? : string;
            colored ? : boolean;
            size ? : number;
            reverse ? : boolean;
        } | true;
        quality ? : {
            value: number;
        };
        security ? : {
            policy: string;
            signature ? : string;
        };
        output ? : {
            format: string;
            colorspace ? : string;
            strip ? : boolean;
            quality ? : number;
            page ? : number;
            compress ? : boolean;
            density ? : number;
            background ? : string;
            secure ? : boolean;
            docinfo ? : boolean;
            pageformat ? : string;
            pageorientation ? : string;
        };
        cache ? : {
            cache ? : boolean;
            expiry: number;
        };
        // audio/video
        video_convert ? : {
            aspect_mode: EVideoAccessMode;
            preset ? : EVideoTypes;
            force ? : boolean;
            title ? : string;
            extname ? : string;
            filename ? : string;
            location ? : EVideoLocations;
            path ? : string;
            access ? : EVideoAccess;
            container ? : string;
            audio_bitrate ? : number;
            upscale: boolean;
            video_bitrate ? : number;
            audio_sample_rate ? : number;
            audio_channels ? : number;
            clip_length ? : string;
            clip_offset ? : string;
            width ? : number;
            height ? : number;
            two_pass ? : boolean;
            fps ? : number;
            keyframe_interval ? : number;
            watermark_url ? : string;
            watermark_top ? : number;
            watermark_bottom ? : number;
            watermark_right ? : number;
            watermark_left ? : number;
            watermark_width ? : number;
            watermark_height ? : number;
        };
    }

    export interface Client {

        /**
         * Clear all current cloud sessions in the picker.
         * Optionally pass a cloud source name to only log out of that cloud source.
         * This essentially clears the OAuth authorization codes from the Filestack session.
         * @param name Optional cloud source name.
         */
        logout(name ? : string);

        /**
         * Retrieve detailed data of stored files.
         *
         * ### Example
         *
         * ```js
         * client
         *   .metadata('DCL5K46FS3OIxb5iuKby')
         *   .then((res) => {
         *     console.log(res);
         *   })
         *   .catch((err) => {
         *     console.log(err);
         *   }));
         * ```
         * @see [File API - Metadata](https://www.filestack.com/docs/api/file#metadata).
         * @param handle Valid Filestack handle.
         * @param options Metadata fields to enable on response.
         * @param security Optional security override.
         */
        metadata(handle: string, options ? : MetadataOptions, security ? : Security);

        /**
         * Construct a new picker instance.
         */
        picker(options ? : PickerOptions): PickerInstance;

        /**
         * Used for viewing files via Filestack handles or storage aliases, __requires Document Viewer addon to your Filestack application__.
         * Opens document viewer in new window if id option is not provided.
         *
         * ### Example
         *
         * ```js
         * // <div id="preview"></div>
         *
         * client.preview('DCL5K46FS3OIxb5iuKby', { id: 'preview' });
         * ```
         * @param handle Valid Filestack handle.
         * @param options Preview options
         */
        preview(handle: string, options ? : PreviewOptions);

        /**
         * Remove a file from storage and the Filestack system.
         *
         * __Requires a valid security policy and signature__. The policy and signature will be pulled from the client session, or it can be overridden with the security parameter.
         *
         * ### Example
         *
         * ```js
         * client
         *   .remove('DCL5K46FS3OIxb5iuKby')
         *   .then((res) => {
         *     console.log(res);
         *   })
         *   .catch((err) => {
         *     console.log(err);
         *   }));
         * ```
         * @see [File API - Delete](https://www.filestack.com/docs/api/file#delete)
         * @param handle Valid Filestack handle.
         * @param security Optional security override.
         */
        remove(handle: string, security ? : Security): Promise<any>;

        /**
         * Remove a file **only** from the Filestack system. The file remains in storage.
         *
         * __Requires a valid security policy and signature__. The policy and signature will be pulled from the client session, or it can be overridden with the security parameter.
         *
         * ### Example
         *
         * ```js
         * client
         *   .removeMetadata('DCL5K46FS3OIxb5iuKby')
         *   .then((res) => {
         *     console.log(res);
         *   })
         *   .catch((err) => {
         *     console.log(err);
         *   }));
         * ```
         * @see [File API - Delete](https://www.filestack.com/docs/api/file#delete)
         * @param handle Valid Filestack handle.
         * @param security Optional security override.
         */
        removeMetadata(handle: string, security ? : Security): Promise<any>;

        /**
         * Store a file from its URL.
         *
         * ### Example
         *
         * ```js
         * client
         *   .storeURL('https://d1wtqaffaaj63z.cloudfront.net/images/NY_199_E_of_Hammertown_2014.jpg')
         *   .then(res => console.log(res));
         * ```
         * @see [File API - Store](https://www.filestack.com/docs/api/file#store)
         * @param url       Valid URL to a file.
         * @param options   Configure file storage.
         * @param token     Optional control token to call .cancel()
         * @param security  Optional security override.
         */
        storeURL(url: string, options ? : StoreOptions, token ? : any, security ? : Security): Promise<Object>;

        /**
         * Access files via their Filestack handles.
         *
         * If head option is provided - request headers are returned in promise
         * If metadata option is provided - metadata object is returned in promise
         * Otherwise file blob is returned
         * Metadata and head options cannot be mixed
         *
         * ### Example
         *
         * ```js
         * client.retrieve('fileHandle', {
         *  metadata: true,
         * }).then((response) => {
         *  console.log(response);
         * }).catch((err) => {
         *  console.error(err);
         * })
         * ```
         *
         * @see [File API - Download](https://www.filestack.com/docs/api/file#download)
         * @param handle    Valid file handle
         * @param options   RetrieveOptions
         * @param security  Optional security override.
         * @throws          Error
         */
        retrieve(handle: string, options ? : RetrieveOptions, security ? : Security): Promise<Object|Blob>;

        /**
         * Interface to the Filestack [Processing API](https://www.filestack.com/docs/api/processing).
         * Convert a URL, handle, or storage alias to another URL which links to the transformed file.
         * You can optionally store the returned URL with client.storeURL.
         *
         * Transform params can be provided in camelCase or snakeCase style ie: partial_pixelate or partialPixelate
         *
         * ### Example
         *
         * ```js
         * const transformedUrl = client.transform(url, {
         *   crop: {
         *     dim: [x, y, width, height],
         *   },
         *   vignette: {
         *     blurmode: 'gaussian',
         *     amount: 50,
         *   },
         *   flip: true,
         *   partial_pixelate: {
         *     objects: [[10, 20, 200, 250], [275, 91, 500, 557]],
         *   },
         * };
         *
         * // optionally store the new URL
         * client.storeURL(transformedUrl).then(res => console.log(res));
         * ```
         * @see [Filestack Processing API](https://www.filestack.com/docs/api/processing)
         * @param url     Valid URL (http(s)://), file handle, or storage alias (src://) to an image.
         * @param options Transformations are applied in the order specified by this object.
         * @returns       A new URL that points to the transformed resource.
         */
        transform(url: string, options: TransformOptions);

        /**
         * Initiates a multi-part upload flow. Use this for Filestack CIN and FII uploads.
         *
         * In Node runtimes the file argument is treated as a file path.
         * Uploading from a Node buffer is not yet implemented.
         *
         * ### Example
         *
         * ```js
         * const token = {};
         * const onRetry = (obj) => {
         *   console.log(`Retrying ${obj.location} for ${obj.filename}. Attempt ${obj.attempt} of 10.`);
         * };
         *
         * client.upload(file, { onRetry }, { filename: 'foobar.jpg' }, token)
         *   .then(res => console.log(res));
         *
         * token.pause();  // Pause flow
         * token.resume(); // Resume flow
         * token.cancel(); // Cancel flow (rejects)
         * ```
         * @param file           Must be a valid [File](https://developer.mozilla.org/en-US/docs/Web/API/File), Blob, base64 encoded string, or file path in Node.
         * @param uploadOptions  Uploader options.
         * @param storeOptions   Storage options.
         * @param token          A control token that can be used to call cancel(), pause(), and resume().
         * @param security       Optional security policy and signature override.
         *
         * @returns {Promise}
         */
        upload(file: any, options ? : UploadOptions, storeOptions ? : StoreOptions, token ? : any, security ? : Security);
    }

    function init(apikey: string, options?: ClientOptions): Client;
}
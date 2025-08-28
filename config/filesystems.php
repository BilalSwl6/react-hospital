<?php

use Spatie\GoogleCloudStorage\GoogleCloudStorageAdapter;
use Spatie\GoogleCloudStorage\UniformBucketLevelAccessVisibility;

return [
    /*
     * |--------------------------------------------------------------------------
     * | Default Filesystem Disk
     * |--------------------------------------------------------------------------
     * |
     * | Here you may specify the default filesystem disk that should be used
     * | by the framework. The "local" disk, as well as a variety of cloud
     * | based disks are available to your application for file storage.
     * |
     */
    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
     * |--------------------------------------------------------------------------
     * | Filesystem Disks
     * |--------------------------------------------------------------------------
     * |
     * | Below you may configure as many filesystem disks as necessary, and you
     * | may even configure multiple disks for the same driver. Examples for
     * | most supported storage drivers are configured here for reference.
     * |
     * | Supported drivers: "local", "ftp", "sftp", "s3"
     * |
     */
    'disks' => [
        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],
        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL') . '/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],
        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],
        'r2' => [
            'driver' => 's3',
            'key' => env('R2_ACCESS_KEY_ID'),
            'secret' => env('R2_SECRET_ACCESS_KEY'),
            'region' => env('R2_REGION', 'auto'),
            'bucket' => env('R2_BUCKET', 'your-bucket-name'),
            'endpoint' => env('R2_ENDPOINT', 'https://<account-id>.r2.cloudflarestorage.com'),
            'use_path_style_endpoint' => true,
        ],
        'gcs' => [
            'driver' => 'gcs',
            'key_file_path' => env('GOOGLE_CLOUD_KEY_FILE'),
            'key_file' => env('GOOGLE_CLOUD_KEY_JSON') ? json_decode(base64_decode(env('GOOGLE_CLOUD_KEY_JSON')), true) : null,
            'project_id' => env('GOOGLE_CLOUD_PROJECT_ID'),
            'bucket' => env('GOOGLE_CLOUD_STORAGE_BUCKET'),
            'path_prefix' => env('GOOGLE_CLOUD_STORAGE_PATH_PREFIX', ''),
            'storage_api_uri' => env('GOOGLE_CLOUD_STORAGE_API_URI', null),
            'api_endpoint' => env('GOOGLE_CLOUD_STORAGE_API_ENDPOINT', null),
            'visibility' => 'private',
            'throw' => true,  // 👈 Add this line
        ],
        'b2' => [
            'driver' => 's3',
            'key' => env('B2_KEY_ID'),
            'secret' => env('B2_APPLICATION_KEY'),
            'region' => env('B2_REGION', 'us-west-002'),  // adjust if needed
            'bucket' => env('B2_BUCKET_NAME'),
            'endpoint' => env('B2_ENDPOINT', 'https://s3.us-west-002.backblazeb2.com'),
            'use_path_style_endpoint' => false,
        ],
    ],

    /*
     * |--------------------------------------------------------------------------
     * | Symbolic Links
     * |--------------------------------------------------------------------------
     * |
     * | Here you may configure the symbolic links that will be created when the
     * | `storage:link` Artisan command is executed. The array keys should be
     * | the locations of the links and the values should be their targets.
     * |
     */
    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],
];

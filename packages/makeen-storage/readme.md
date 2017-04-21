Makeen Storage
==============

Makeen plugin that provides files storage functionality.

Under the hood it uses [hapi-auth-hawk](https://github.com/hapijs/hapi-auth-hawk) for providing a holder-of-key authentication model this way to can share self-expiring pre-authenticated links to non-autneticated users without worring too much about security or password/credential leaks.

#### Requirements
- Node v6 or higher

#### Installation
`npm install makeen-storage`

#### Usage

When registering the plugin you need to pass it `uploadDir` - the path where files will be stored and `bewitCredentials` - an object with `key` and `algorithm` (default is sha256) fields.

Once loaded the plugin will expose 4 REST endpoints for uploading, downloading, deleting and signing files:

```
  DELETE /files/{fileId}                Delete a file
  GET    /files/{fileId}/download       Download a file
  POST   /files/sign-url                Sign a file download
  POST   /files/upload                  Upload a file
```

On the backend the server also exposes the File and FileRepository octobus service containers. FileRepository service will
export the CRUD database functionality while the File service container will provide the storage functionality for upload, download, signing and deleting files.
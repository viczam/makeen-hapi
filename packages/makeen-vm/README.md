makeen-vm
==========
Makeen plugin for managing AWS and Azure virtual machines.

The plugin requires the following options to be passed during registration:

```js
{
  "auth": false,
  "awsCredentials": {
    "apiVersion": "",
    "region": "",
    "accessKeyId": "",
    "secretAccessKey": ""
  },
  "azureCredentials": {
    "key": "",
    "appId": "",
    "tenantId": "",
    "subscriptionId": "",
    "user": "",
    "password": ""
  }
}
```

If aws or azure field is missing altogether then the respective cloud provider is skipped.

`auth` option is false by default making the endpoints bublic. In order to secure them and add authorization you can switch to`jwt`.

If proper credentials are being past then the plugin will expose REST endpoints to list, start and stop cloud (AWS and Azure) virtual machines:
![](assets/makeen_vm_routes.png?raw=true)
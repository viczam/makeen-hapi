import Joi from 'joi';

/**
 * State codes
        0 : pending
        16 : running
        32 : shutting-down
        48 : terminated
        64 : stopping
        80 : stopped
 */

const instanceSchema = Joi.object()
  .keys({
    InstanceId: Joi.string(),
    ImageId: Joi.string(),
    State: Joi.object()
      .keys({
        Code: Joi.number().example(80),
        Name: Joi.string().example('stopped'),
      })
      .unknown(),
    PrivateDnsName: Joi.string(),
    PublicDnsName: Joi.string().allow(''),
    StateTransitionReason: Joi.string().allow(''),
    KeyName: Joi.string(),
    AmiLaunchIndex: Joi.number(),
    ProductCodes: Joi.array(),
    InstanceType: Joi.string(),
    LaunchTime: Joi.date(),
    Placement: Joi.object()
      .keys({
        AvailabilityZone: Joi.string(),
        GroupName: Joi.string().allow(''),
        Tenancy: Joi.string(),
      })
      .unknown(),
    StateReason: Joi.object()
      .keys({
        Code: Joi.string().example('Client.UserInitiatedShutdown'),
        Message: Joi.string().example(
          'Client.UserInitiatedShutdown: User initiated shutdown',
        ),
      })
      .unknown(),
    Monitoring: Joi.object()
      .keys({
        State: Joi.string(),
      })
      .unknown(),
    SubnetId: Joi.string(),
    VpcId: Joi.string(),
    PrivateIpAddress: Joi.string(),
    PublicIpAddress: Joi.string(),
    Architecture: Joi.string(),
    RootDeviceType: Joi.string(),
    RootDeviceName: Joi.string(),
    BlockDeviceMappings: Joi.array().items(
      Joi.object()
        .keys({
          DeviceName: Joi.string(),
          Ebs: Joi.object().keys({
            VolumeId: Joi.string(),
            Status: Joi.string(),
            AttachTime: Joi.date(),
            DeleteOnTermination: Joi.bool(),
          }),
        })
        .unknown(),
    ),
    VirtualizationType: Joi.string(),
    ClientToken: Joi.string(),
    Tags: Joi.array(),
    SecurityGroups: Joi.array().items(
      Joi.object()
        .keys({
          GroupName: Joi.string().allow(''),
          GroupId: Joi.string(),
        })
        .unknown(),
    ),
    SourceDestCheck: Joi.bool(),
    Hypervisor: Joi.string(),
    EbsOptimized: Joi.bool(),
    NetworkInterfaces: Joi.array().items(
      Joi.object()
        .keys({
          NetworkInterfaceId: Joi.string(),
          SubnetId: Joi.string(),
          VpcId: Joi.string(),
          Description: Joi.string().allow(''),
          OwnerId: Joi.string(),
          Status: Joi.string(),
          MacAddress: Joi.string(),
          PrivateIpAddress: Joi.string(),
          PrivateDnsName: Joi.string(),
          SourceDestCheck: Joi.bool(),
          Groups: Joi.array().items(
            Joi.object()
              .keys({
                GroupName: Joi.string().allow(''),
                GroupId: Joi.string(),
              })
              .unknown(),
          ),
          Attachment: Joi.object()
            .keys({
              AttachmentId: Joi.string(),
              DeviceIndex: Joi.number(),
              Status: Joi.string(),
              AttachTime: Joi.date(),
              DeleteOnTermination: Joi.bool(),
            })
            .unknown(),
          Association: Joi.object()
            .keys({
              PublicIp: Joi.string(),
              PublicDnsName: Joi.string().allow(''),
              IpOwnerId: Joi.string(),
            })
            .unknown(),
          PrivateIpAddresses: Joi.array().items(
            Joi.object()
              .keys({
                PrivateIpAddress: Joi.string(),
                PrivateDnsName: Joi.string(),
                Primary: Joi.bool(),
                Association: Joi.object({
                  PublicIp: Joi.string(),
                  PublicDnsName: Joi.string().allow(''),
                  IpOwnerId: Joi.string(),
                }).unknown(),
              })
              .unknown(),
          ),
          Ipv6Addresses: Joi.array(),
        })
        .unknown(),
    ),
    EnaSupport: Joi.bool(),
  })
  .unknown();

export const listInstancesResponse = Joi.object().keys({
  Reservations: Joi.array().items(
    Joi.object()
      .keys({
        ReservationId: Joi.string(),
        OwnerId: Joi.string(),
        Groups: Joi.array(),
        Instances: Joi.array().items(instanceSchema),
        EbsOptimized: Joi.bool(),
      })
      .unknown(),
  ),
});

export const stopInstancesResponse = Joi.object().keys({
  StoppingInstances: Joi.array().items(
    Joi.object().keys({
      InstanceId: Joi.string(),
      CurrentState: Joi.object().keys({
        Code: Joi.number(),
        Name: Joi.string(),
      }),
      PreviousState: Joi.object().keys({
        Code: Joi.number(),
        Name: Joi.string(),
      }),
    }),
  ),
});

export const startInstancesResponse = Joi.object().keys({
  StartingInstances: Joi.array().items(
    Joi.object().keys({
      InstanceId: Joi.string(),
      CurrentState: Joi.object().keys({
        Code: Joi.number(), // 0 - pending; 80 - stopped
        Name: Joi.string(),
      }),
      PreviousState: Joi.object().keys({
        Code: Joi.number(),
        Name: Joi.string(),
      }),
    }),
  ),
});

export const awsOptionsSchema = {
  accessKeyId: Joi.string().required(),
  secretAccessKey: Joi.string().required(),
  apiVersion: Joi.string(),
  region: Joi.string(),
};

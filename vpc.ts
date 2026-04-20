import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";

interface VpcArgs {
    ownerTag?: pulumi.Input<string>
}

interface VpcData {
  vpcId: pulumi.Output<string>;
  publicSubnetIds: pulumi.Output<string[]>;
  privateSubnetids: pulumi.Output<string[]>;
}

export class Vpc extends pulumi.ComponentResource<VpcData> {
  constructor(
    name: string,
    args?: VpcArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super("x:index:Vpc", name, { name, args, opts });
  }

  protected async initialize(props: {
    name: string;
    args: VpcArgs;
    opts: pulumi.ComponentResourceOptions;
  }): Promise<VpcData> {
    const { name, args } = props;

    let ownerTag: pulumi.Input<string> = "undefined";

    if (args.ownerTag !== undefined) {
        ownerTag = args.ownerTag;
    }

    const vpc = new awsx.ec2.Vpc("vpc", {
      cidrBlock: "10.0.0.0/16",
      subnetSpecs: [
        {
          type: awsx.ec2.SubnetType.Public,
          name: "eks-public-subnets",
          tags: {
            "owner": ownerTag
          },
        },
        {
          type: awsx.ec2.SubnetType.Private,
          name: "eks-private-subnets",
          tags: {
            "owner": ownerTag
          },
        },
      ],
      subnetStrategy: "Auto",
      natGateways: {
        strategy: awsx.ec2.NatGatewayStrategy.Single,
      },
      tags: {
        "owner": ownerTag
      }
    });

    return {
        vpcId: vpc.vpcId,
        publicSubnetIds: vpc.publicSubnetIds,
        privateSubnetids: vpc.privateSubnetIds
    }
  }
}

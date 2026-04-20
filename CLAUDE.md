# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npx tsc              # Type-check (no emit configured by default)
npx tsc --noEmit     # Type-check without emitting JS
```

There are no tests configured.

## Architecture

This is a **Pulumi component provider** written in TypeScript. It exposes a reusable `Vpc` component that can be consumed by Pulumi programs in any language via the component provider host mechanism.

- `PulumiPlugin.yaml` — declares this as a Node.js Pulumi plugin
- `index.ts` — entry point; registers `Vpc` with `componentProviderHost` under the name `"vpc"`
- `vpc.ts` — defines the `Vpc` component resource (type `x:index:Vpc`) using `@pulumi/awsx`

### `Vpc` component (`vpc.ts`)

Extends `pulumi.ComponentResource<VpcData>` using the async `initialize` pattern (logic lives in `initialize`, not the constructor). It creates an `awsx.ec2.Vpc` with:
- CIDR `10.0.0.0/16`
- Public and private subnets tagged `eks-public-subnets` / `eks-private-subnets`
- Single NAT gateway strategy
- Optional `ownerTag` propagated to all subnet and VPC tags

Outputs: `vpcId`, `publicSubnetIds`, `privateSubnetids` (note: typo in field name — `privateSubnetids` not `privateSubnetIds`).

import {componentProviderHost} from "@pulumi/pulumi/provider/experimental";
import { Vpc } from "./vpc";

componentProviderHost({
    components: [Vpc],
    name: "vpc"
});


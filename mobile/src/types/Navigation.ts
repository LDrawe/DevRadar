import { RouteProp } from "@react-navigation/core";

export type StackParamsProps = {
    Main: undefined,
    Profile: {
        github_username: string
    },
}

export type ProfileScreenRouteProp = RouteProp<StackParamsProps, 'Profile'>;
 
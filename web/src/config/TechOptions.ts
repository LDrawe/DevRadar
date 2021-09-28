import { SelectProps } from '../types/Select';

const options: SelectProps[] = [
    {
        label: "Backend",
        options: [
            { label: "NodeJS", value: "NodeJS" },
            { label: "Java", value: "Java" },
            { label: "C++", value: "C++" },
            { label: "Ruby", value: "Ruby" },
            { label: "SQL", value: "SQL" }
        ]
    },
    {
        label: "Frontend",
        options: [
            { label: "React", value: "React" },
            { label: "Angular", value: "Angular" },
            { label: "Vue", value: "Vue" },
            { label: "NextJS", value: "NextJS" },
            { label: "Svelte", value: "Svelte" }
        ]
    },
    {
        label: "Mobile",
        options: [
            { label: "React Native", value: "React Native" },
            { label: "Flutter", value: "Flutter" }
        ]
    },
];

export default options;
import { FC, useEffect, useState } from 'react';
import DevProps from '../../types/Devs';
import axios from 'axios';
import './DevCard.css';

const DevCard: FC<DevProps> = dev => {

    const [data, setData] = useState({
        name: '',
        bio: '',
        avatar_url: ''
    });

    async function loadGithubInfo() {
        try {
            const response = await axios.get(`https://api.github.com/users/${dev.github_username}`);
            setData({
                name: response.data.name,
                bio: response.data.bio,
                avatar_url: response.data.avatar_url
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadGithubInfo(); // eslint-disable-next-line
    }, [dev]);

    return (
        <li className="dev-item" >
            <header>
                <img src={data.avatar_url} alt="Imagem de Perfil" />
                <div className="user-info">
                    <strong>
                        {data.name || dev.github_username}
                    </strong>
                    <span>
                        {dev.techs.join(', ')}
                    </span>
                </div>
            </header>

            <p>
                {data.bio || 'Este desenvolvedor ainda não possui uma biografia'}
            </p>

            <a href={`https://github.com/${dev.github_username}`} target="_blank" rel="noreferrer" >
                Acessar perfil no GitHub
            </a>
        </li>
    );
};

export default DevCard;
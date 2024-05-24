import ReactPlayer from 'react-player';

export default function Video({url, width, height}) {
    return (
        <div>
            <ReactPlayer 
                url={url}
                playing={false}
                controls={true}
                width={width}
                height={height}
            />
        </div>
    )
}
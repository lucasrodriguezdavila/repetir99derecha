import "./index.css";

interface Props {
  url: string;
}

const YoutubeEmbed = ({ url }: Props) => (
  <div className="video-responsive">
    <iframe
      width="853"
      height="480"
      src={url}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

export default YoutubeEmbed;

import { SquareUser as UserSquare2, Images, LayoutTemplate, Film, Award, Eraser, ArrowLeftRight, Image as ImageIcon, Video } from 'lucide-react';

interface ToolIconProps {
  iconName: string;
  size?: number;
  color?: string;
}

export default function ToolIcon({ iconName, size = 32, color = '#ffffff' }: ToolIconProps) {
  const props = { size, color };

  switch (iconName) {
    case 'user-square': return <UserSquare2 {...props} />;
    case 'image-play': return <Images {...props} />;
    case 'layout-template': return <LayoutTemplate {...props} />;
    case 'film': return <Film {...props} />;
    case 'award': return <Award {...props} />;
    case 'eraser': return <Eraser {...props} />;
    case 'vector': return <ArrowLeftRight {...props} />;
    case 'image-edit': return <ImageIcon {...props} />;
    case 'video': return <Video {...props} />;
    default: return <ImageIcon {...props} />;
  }
}

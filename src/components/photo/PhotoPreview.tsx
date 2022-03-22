import {
  Card,
  CardContent,
  Typography,
  Link,
  Button,
  Stack,
  Chip
} from '@mui/material';
import { Link as RouterLink } from "react-router-dom";

const PhotoPreview = ({ image, album }) => {
  return (
    <Card>
      <CardContent>
        <img
          src={image.data.replace("./public", "")}
          alt={image.caption}
          width="100%"
        />
        <Typography variant="body1" mt={2}>
          {image.caption}
        </Typography>
        <Typography variant="body2">
          By {album.first_name} {album.last_name}
        </Typography>
        <Stack direction="row" spacing={2} my={2}>
          {image?.tags?.map((tag) => (
            <Chip key={tag.tag_name} label={tag.tag_name} />
          ))}
        </Stack>
        <Link component={RouterLink} to={`/photo/${image.photo_id}`}>
          <Button variant="contained">View</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PhotoPreview;
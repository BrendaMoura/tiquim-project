import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { CommentHeader } from "./CommentHeader";
import { useUser } from "@/app/hooks/useUser";
import { Comment } from "@/app/types/comment";
import { useEffect, useState } from "react";
import { getAvatarUser } from "@/app/services/user";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { createReportComment } from "@/app/services/report";
import AlertDialog from "../DialogConfirmationDelete";
import useSnackbar from "../../hooks/useSnackbar";

interface CommentCardProps {
  comment: Comment;
  id: string;
}

export function CommentCard({ comment, id }: CommentCardProps) {
  const { user } = useUser(comment.userId);
  const [avatar, setAvatar] = useState<string>("/placeholder.png");
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const { setSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchImage = async () => {
      if (user?.avatarUrl && user?.avatarUrl.length > 0) {
        const image = await getAvatarUser(user?.avatarUrl);
        setAvatar(image);
      }
    };
    fetchImage();
  }, [user?.avatarUrl]);

  const handleReportBtn = () => {
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleReport = async () => {
    try {
      await createReportComment(comment.id);
      setSnackbar("Denúncia feita");
      setAnchorEl(null);
      setConfirmOpen(false);
    } catch (error: any) {
      if (error.message === "Request failed with status code 400") {
        setSnackbar("Você já denunciou este comentário anteriormente", "error");
        setAnchorEl(null);
        setConfirmOpen(false);
      } else {
        console.log(error.message, "LEL");
        setSnackbar("Ocorreu um erro. Tente novamente mais tarde", "error");
        setAnchorEl(null);
        setConfirmOpen(false);
      }
    }
  };

  return (
    <Card sx={{ width: { xs: "100%", sm: "80%" }, margin: "5px auto", boxShadow: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "black" }} aria-label="recipe">
            {avatar ? (
              <Box
                component="img"
                sx={{
                  height: 40,
                  width: 40,
                }}
                src={avatar}
              />
            ) : (
              <AccountCircleIcon sx={{ height: "auto", width: "auto" }} />
            )}
          </Avatar>
        }
        action={
          id && (
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          )
        }
        title={<CommentHeader user={user?.name ?? ""} createdAt={comment.createdAt} />}
      />
      <CardContent
        sx={{
          pt: 0,
        }}
      >
        <Typography
          variant="body1"
          color="text.primary"
          sx={{
            wordBreak: "break-word",
          }}
        >
          {comment.text}
        </Typography>
      </CardContent>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleReportBtn}>Denunciar</MenuItem>
      </Menu>
      <AlertDialog
        open={confirmOpen}
        onConfirm={handleReport}
        onCancel={handleConfirmClose}
        message={"Tem certeza que deseja denunciar esse comentário?"}
      />
    </Card>
  );
}

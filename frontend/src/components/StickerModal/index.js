import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Paper, Typography } from "@material-ui/core";
import api from "../../services/api";
import toastError from "../../errors/toastError";

const StickerModal = ({ open, onClose, onSelected }) => {
  const [stickers, setStickers] = useState([]);
  const [, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchTickets = async () => {
      try {
        const { data } = await api.get("/stickers");
        setStickers(data.stickers);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        toastError(err);
      }
    };
    fetchTickets();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" scroll="paper">
      <DialogContent style={{ background: "#ffffff" }}>
        <Paper elevation={0} style={{ background: "#ffffff", padding: "20px" }}>
          <Typography color="primary" gutterBottom>
            Selecione uma figurinha para enviar
          </Typography>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              height: 300,
              width: 600,
              overflow: "auto",
            }}
          >
            {stickers.length > 0 ? (
              stickers.map((sticker, index) => (
                <img
                  key={index}
                  src={sticker.path}
                  alt={`sticker-${index}`}
                  style={{
                    width: "110px",
                    height: "110px",
                    cursor: "pointer",
                    borderRadius: "10px",
                  }}
                  onClick={() => {
                    onSelected(sticker.path);
                    onClose();
                  }}
                />
              ))
            ) : (
              <Typography variant="body1">
                Nenhuma figurinha disponível
              </Typography>
            )}
          </div>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default StickerModal;

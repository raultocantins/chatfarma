import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import SalesModal from "../SalesModal";

const FinishModal = ({ title, children, open, onClose, onConfirm, primaryText, secondaryText }) => {

	const [salesModal, setSalesModal] = useState(false);
	const [sendFarewell, setSendFarewell] = useState(false);
	useEffect(() => {
		if (!open) {
			setSalesModal(false);
			setSendFarewell(false);
		}
	}, [open]);

	return (
		<Dialog
			open={open}
			onClose={() => onClose(false)}
			aria-labelledby="confirm-dialog"
		>
			<SalesModal
				open={salesModal}
				onClose={() => setSalesModal(false)}
				aria-labelledby="form-dialog-title"
				onSave={() => {
					onClose(false);
					onConfirm(sendFarewell);
				}}
			/>
			<DialogTitle id="confirm-dialog">{title}</DialogTitle>
			<DialogContent dividers>
				<Typography>{children}</Typography>
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					onClick={() => {
						setSendFarewell(false)
						setSalesModal(true)
					}
					}
					color="default"
				>
					{secondaryText}
				</Button>
				<Button
					variant="contained"
					onClick={() => {
						setSendFarewell(true)
						setSalesModal(true)
					}}
					color="secondary"
				>
					{primaryText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default FinishModal;

import React, { useState, useEffect } from "react";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";

import {
	FormControl,
} from "@material-ui/core";

const SendContactModal = ({ modalOpen, onClose, ticketId }) => {

	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchParam, setSearchParam] = useState("");
	const [selectedContact, setSelectedContact] = useState(null);

	useEffect(() => {
		if (!modalOpen || searchParam.length < 3) {
			setLoading(false);
			return;
		}
		setLoading(true);
		const delayDebounceFn = setTimeout(() => {
			const fetchContacts = async () => {
				try {
					const { data } = await api.get("contacts", {
						params: { searchParam },
					});
					setOptions(data.contacts);
					setLoading(false);
				} catch (err) {
					setLoading(false);
					toastError(err);
				}
			};

			fetchContacts();
		}, 500);
		return () => clearTimeout(delayDebounceFn);
	}, [searchParam, modalOpen]);

	const handleClose = () => {
		onClose();
		setSearchParam("");
		setSelectedContact(null);
		setOptions([])
	};

	const handleSelectOption = (e, newValue) => {
		if (newValue?.number) {
			setSelectedContact(newValue);
		}
	};

	const renderOption = option => {
		if (option.number) {
			return `${option.name} - ${option.number}`;
		}
	};

	const renderOptionLabel = option => {
		if (option.number) {
			return `${option.name} - ${option.number}`;
		}
	};

	const handleSendMessage = async (contact) => {
		if (!contact?.id) return;
		setLoading(true);
		const message = {
			read: 1,
			fromMe: true,
			contactNumber: contact?.number,
		};
		try {
			await api.post(`/messages/contact/${ticketId}`, message);
		} catch (err) {
			toastError(err);
		}
		onClose();
	};

	return (
		<>

			<Dialog open={modalOpen} onClose={handleClose}>
				<DialogTitle id="form-dialog-title">
					{i18n.t("sendContactModal.title")}
				</DialogTitle>
				<FormControl>
					<DialogContent dividers>
						<Autocomplete
							options={options}
							loading={loading}
							style={{ width: 300 }}
							clearOnBlur
							autoHighlight
							freeSolo
							clearOnEscape
							getOptionLabel={renderOptionLabel}
							renderOption={renderOption}
							onChange={(e, newValue) => handleSelectOption(e, newValue)}
							renderInput={params => (
								<TextField
									{...params}
									label={i18n.t("newTicketModal.fieldLabel")}
									variant="outlined"
									autoFocus
									required
									onChange={e => setSearchParam(e.target.value)}
									onKeyPress={e => {
										if (loading || !selectedContact) return;
										else if (e.key === "Enter") {
											handleSendMessage(selectedContact)
										}
									}}
									InputProps={{
										...params.InputProps,
										endAdornment: (
											<React.Fragment>
												{loading ? (
													<CircularProgress color="inherit" size={20} />
												) : null}
												{params.InputProps.endAdornment}
											</React.Fragment>
										),
									}}
								/>
							)}
						/>
						<DialogContent />
					</DialogContent>
				</FormControl>
				<DialogActions>
					<Button
						onClick={handleClose}
						color="secondary"
						disabled={loading}
						variant="outlined"
					>
						{i18n.t("sendContactModal.buttons.cancel")}
					</Button>
					<ButtonWithSpinner
						variant="contained"
						type="button"
						disabled={!selectedContact}
						onClick={() => handleSendMessage(selectedContact)}
						color="primary"
						loading={loading}
					>
						{i18n.t("sendContactModal.buttons.ok")}
					</ButtonWithSpinner>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default SendContactModal;

function showConfirmationPanel(message, onConfirm, onCancel)
{
    const overlay = document.createElement('div');
    overlay.classList.add('confirmation_overlay');

    const panel = document.createElement('div');
    panel.classList.add('confirmation_panel');

    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    panel.appendChild(messageElement);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('confirmation_buttons');

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
    confirmButton.classList.add('confirm_btn');

    confirmButton.onclick = () => {
        onConfirm();
        document.body.removeChild(overlay);
    };

    buttonsContainer.appendChild(confirmButton);

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.classList.add('cancel_btn');

    cancelButton.onclick = () => {
        if ( onCancel ) onCancel();
        document.body.removeChild(overlay);
    };

    buttonsContainer.appendChild(cancelButton);
    panel.appendChild(buttonsContainer);
    overlay.appendChild(panel);

    document.body.appendChild(overlay);
}
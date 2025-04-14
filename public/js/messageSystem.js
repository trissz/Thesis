const MessageSystem = (() => {
    const icons = {
        success: '<svg class="message_icon" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
        error: '<svg class="message_icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
        warning: '<svg class="message_icon" viewBox="0 0 24 24"><path fill="currentColor" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>',
        info: '<svg class="message_icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>'
    };

    const createMessage = (type, message, allowClose = true) => {
        const messageElement = document.createElement('div');
        messageElement.className = `message message_${type}`;
        messageElement.innerHTML = `${icons[type]}<span class="message_text">${message}</span>`;

        if ( allowClose )
        {
            messageElement.innerHTML += '<button class="message_close">&times;</button>';

            messageElement.querySelector('.message_close').addEventListener('click', () => {
                messageElement.remove();
            });
        }

        return messageElement;
    };

    return {
        append(type, message, container, allowClose = true, duration)
        {
            if ( !(container instanceof HTMLElement) )
            {
                throw new Error('Container must be a DOM element');
            }

            const messageElement = createMessage(type, message, allowClose);
            container.appendChild(messageElement);

            if ( duration && duration > 0 )
            {
                setTimeout(() => messageElement.remove(), duration);
            }
        },
        
        popup(type, message, container = document.body, allowClose = true, duration)
        {
            const wrapper = document.createElement('div');
            wrapper.className = 'message_popup_wrapper';
            wrapper.innerHTML = `<div class="message_popup_backdrop"></div><div class="message_popup_content"></div>`;

            const content = wrapper.querySelector('.message_popup_content');
            content.appendChild(createMessage(type, message, allowClose));
            
            container.appendChild(wrapper);
            wrapper.style.display = 'flex';

            wrapper.addEventListener('click', (event) => {
                if ( event.target.closest('.message_popup_backdrop') )
                {
                    wrapper.remove();
                }
            });

            if ( duration && duration > 0 )
            {
                setTimeout(() => wrapper.remove(), duration);
            }
        },

        toast(type, message, container = document.body, allowClose = true, duration)
        {
            const messageElement = createMessage(type, message, allowClose);
            messageElement.classList.add('message_toast');
            container.appendChild(messageElement);

            if ( duration && duration > 0)
            {
                setTimeout(() => messageElement.remove(), duration);
            }
        },

        float(type, message, allowClose = true, duration = 3000)
        {
            const messageElement = createMessage(type, message, allowClose);
            messageElement.classList.add('message_float');
            
            messageElement.style.cssText = `
                position: fixed;
                top: -100px;
                left: 50%;
                transform: translateX(-50%);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1002;
            `;

            document.body.appendChild(messageElement);

            requestAnimationFrame(() => {
                messageElement.style.top = '20px';
                messageElement.style.opacity = '1';
            });

            const startExit = () => {
                messageElement.style.top = '-100px';
                messageElement.style.opacity = '0';
                
                setTimeout(() => messageElement.remove(), 400);
            };

            let timeoutId;

            if ( duration > 0 )
            {
                timeoutId = setTimeout(startExit, duration);
            }

            if ( allowClose )
            {
                const closeButton = messageElement.querySelector('.message_close');

                if ( closeButton )
                {
                    closeButton.addEventListener('click', () => {
                        clearTimeout(timeoutId);
                        startExit();
                    });
                }
            }
        },
        
        custom(type, message, position, container = document.body, allowClose, duration)
        {
            const messageElement = createMessage(type, message, allowClose);

            Object.assign(messageElement.style, {
                position: 'absolute',
                ...position
            });
            
            container.appendChild(messageElement);

            if ( duration && duration > 0 )
            {
                setTimeout(() => messageElement.remove(), duration);
            }
        }
    };
})();
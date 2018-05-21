/**
 * The exitDisclaimer script in ContentPage on CGov will only run on the initial page load. That means
 * once the user starts navigating r4r, none of the typical injection scripts will rerun. Certain functionality may need ]
 * to be manually retriggered, or replicated. In this particular case, for simplicity's sake, I have replicated the
 * exitDisclaimer script (with more limited functionality since there are less edge cases) and will subscribe it to location
 * changes in the eventHandler.
 */
export const exitDisclaimerInjector = () => {
    // Cleanup all old disclaimers (simple approach)
    const extantDisclaimers = document.querySelectorAll('.r4r-container .icon-exit-notification');
    extantDisclaimers.forEach(node => {
        node.parentNode.removeChild(node);
    });

    // Find all external links
    const allLinks = document.querySelectorAll('.r4r-container a');
    const externalLinks = Array.from(allLinks).filter(link => {
        return /^https?:\/\/([a-zA-Z0-9-]+\.)+/i.test(link.href) 
                && !/^https?:\/\/([a-zA-Z0-9-]+\.)+gov/i.test(link.href) 
                    && link.href !== "";
    })
    
    // Replicate the disclaimer used on CGOV
    const disclaimerLink = document.createElement('a');
    disclaimerLink.classList.add('icon-exit-notification');
    disclaimerLink.title = 'Exit Disclaimer';
    disclaimerLink.href = "/policies/linking";
    const innerSpan = document.createElement('span');
    innerSpan.classList.add('hidden');
    innerSpan.innerText = 'Exit Notification';
    disclaimerLink.appendChild(innerSpan);

    // Attach clones 
    externalLinks.forEach(node => {
        node.parentNode.appendChild(disclaimerLink.cloneNode(true))
    });

    return externalLinks;
}

// Listen for changes to the location and rerun the exitDisclaimerInjector
export const exitDisclaimerEventHandler = (event) => {
    // TODO: This method of detecting location changes is temporary and will need to be rewritten
    // once the analytics middleware has been fleshed out.
    if(event.length === 2 && typeof event[1] === 'string'){
        console.log('Location change detected by exitDisclaimer listener')
        // The location change action event publishes before the dom is rerendered by React. We need a bit of a delay.
        // 100ms should be excessive.
        setTimeout(() => {
            exitDisclaimerInjector();
        }, 100)
    }
}
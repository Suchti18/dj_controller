import debugIcon from '../../../assets/debug.svg';
import './DebugMenu.css';

const DebugMenu = () => {
    const drag = (event: DragEvent) => {
        //TODO: Add window dragging
        console.log(event);
    }

    const closeMenu = () => {
        const menu = document.getElementById("menu");

        if (menu) menu.style.display = "none";
    }

    const openDebugMenu = () => {
        let menu = document.getElementById("menu");

        if (!menu) {
            menu = document.createElement("div");
            menu.id = "menu";
            menu.innerHTML = `
                <h2>Debug</h2>
                <p>Current Song: </p>`;

            const closeBtn = document.createElement("button");
            closeBtn.type = "button";
            closeBtn.innerHTML = "&times;";
            closeBtn.classList.add("close-btn");
            closeBtn.addEventListener("click", closeMenu);

            menu.appendChild(closeBtn);
            menu.addEventListener("drag", (event) => drag(event));
            document.body.appendChild(menu);
        }

        menu.style.display = "block";
    }

    return (
        <>
            <img
                className="debugMenuIcon"
                src={debugIcon}
                alt="debugMenuIcon"
                height="32"
                width="32"
                onClick={openDebugMenu}
            />
        </>
    )
}

export default DebugMenu
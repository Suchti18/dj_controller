import infoIcon from '../../../assets/info.svg';
import './InfoMenu.css';

const InfoMenu = () => {
    const closeMenu = () => {
        const overlay = document.getElementById("overlay");
        const menu = document.getElementById("menu");

        if (overlay) overlay.style.display = "none";
        if (menu) menu.style.display = "none";
    }

    const openInfoMenu = () => {
        let overlay = document.getElementById("overlay");
        let menu = document.getElementById("menu");

        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "overlay";
            document.body.appendChild(overlay);
            overlay.addEventListener("click", closeMenu);
        }

        if (!menu) {
            menu = document.createElement("div");
            menu.id = "menu";
            menu.setAttribute("role", "dialog");
            menu.setAttribute("aria-modal", "true");

            const title = document.createElement("h2");
            title.textContent = "Information";

            const closeBtn = document.createElement("button");
            closeBtn.type = "button";
            closeBtn.textContent = "Close";
            closeBtn.addEventListener("click", closeMenu);

            menu.appendChild(title);
            menu.appendChild(closeBtn);
            document.body.appendChild(menu);
        }

        overlay.style.display = "block";
        menu.style.display = "block";
    }

    return (
        <>
            <img
                className="infoMenuIcon"
                src={infoIcon}
                alt="infoMenuIcon"
                height="32"
                width="32"
                onClick={openInfoMenu}
            />
        </>
    )
}

export default InfoMenu
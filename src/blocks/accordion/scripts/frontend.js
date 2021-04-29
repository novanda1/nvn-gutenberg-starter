const accordion = document.querySelector('.erb-accordion')
if (accordion) {
    const accordionSingle = [...accordion.querySelectorAll('.erb-accordion__single')]

    let accordionState = {
        activeIndex: -1
    }

    const toggleAriaExpanded = (element, conditions, attribute) => {
        if (conditions)
            element.setAttribute('aria-expanded', attribute)
    }

    const handleToggleAccordion = (title, index) => {
        if (accordionState.activeIndex === index) {
            accordionState.activeIndex = -1
            title.classList.remove('active')
            title.setAttribute('aria-expanded', 'false')
            return
        }

        accordionSingle.map((accordion => {
            accordion.querySelector('.erb-accordion__single-head').classList.remove('active')
            accordion.querySelector('.erb-accordion__single-head').setAttribute('aria-expanded', 'false')
        }))

        accordionState.activeIndex = index
        title.classList.add('active')
        title.setAttribute('aria-expanded', 'true')
    }

    accordionSingle.map((accordion, index) => {
        const title = accordion.querySelector('.erb-accordion__single-head')
        title.addEventListener('click', () => handleToggleAccordion(title, index))
        title.onkeypress = (event) => {
            switch (event.code) {
                case ("Enter"):
                case ("Space"):
                    handleToggleAccordion(title, index)
                    break;
            }
            event.preventDefault();
        }
    })
}
export const GoToID = (id: string|null) => () => {
    if(!id){return}
    const element = document.getElementById(id);
    
    if (element) {
    
        element.scrollIntoView({
            behavior: 'smooth', 
            block: 'start'      
        });
    } 
};
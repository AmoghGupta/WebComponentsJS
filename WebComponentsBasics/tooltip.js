// HTMLElement is a predefined class to create custom HTML elements
class Tooltip extends HTMLElement{

  
    
    // lifecycle methods
    // => constructor (preparation) 
    // => connectedCallback (element in dom now)
    // => disconnectedCallback(cleanup)
    // => attributeChangedCallback (listening to attribute changes)
    
    constructor(){
        super();
        //js doesn't have class level properties
        // you have to create class level properties inside constructor
        this.tooltipText;
        this.tooltipIcon;
        this._tooltipVisible = false;

        // enable shadow DOM
        // this creates a separate html dom for this called shadow Dom
        this.attachShadow({
            //MODE whether you can access the shadown dom tree from outside or not
            mode: 'open'
        });
        
        //accessing the shadow DOM
        //style applies only inside the shadow DOM
        this.shadowRoot.innerHTML = `
            <style>
                /* Assign style to the host element i.e my-tooltip element */
                :host(.important){
                    border: 1px solid red;
                    padding: 0.15rem;
                    background: grey;
                }
                /* Assign style to the host element i.e my-tooltip element if is wrapped inside a p */
                :host-context(p){
                    color: pink;
                }
                div{
                    color: white;
                    background: var(--color-primary);
                    position: absolute;
                    zIndex:10;
                }
                .icon{
                    background-color: black;
                    color: white;
                    font-size: 12px;
                    border-radius: 40%;
                    padding: 5px;
                }
                ::slotted(.highlight){
                    background-color: inherit;
                }
            </style>
            <!--Slotted contents is not inside the shadow dom, its inside normal dom-->
            <!-- So styles applied to normal DOM would apply to slot -->
            <!-- Use ::slotted pseudo selected to style slotted content -->
            <slot>Some default</slot>
            <span class="icon">&nbsp;(?)</span>
        `;
    } 
    
    // at this point the custom element is rendered in DOM
    connectedCallback(){
        this.tooltipIcon = this.shadowRoot.querySelector('span');
        this.tooltipText = this.getAttribute('tooltiptext');
        //attaching listner
        this.tooltipIcon.addEventListener("mouseenter",this._showtoolTip.bind(this));
        this.tooltipIcon.addEventListener("mouseleave", this._hidetoolTip.bind(this));

        this._render();
    }

    //whenver the attribute changes inside a webcomponent
    attributeChangedCallback(name, oldValue, newValue){
        if(oldValue == newValue){
            return;
        }
        if(name == "tooltiptext"){
            this.tooltipText = newValue;
        }
    }
    //set watchers to the attributes you want to watch
    static get observedAttributes(){
        return ['tooltiptext'];
    }

    _render(){
        let tooltipContainer = this.shadowRoot.querySelector('div');
        if(this._tooltipVisible){
            tooltipContainer = document.createElement('div');
            tooltipContainer.textContent = this.tooltipText;
            this.shadowRoot.appendChild(tooltipContainer);
        }else{
            if(tooltipContainer){
                this.shadowRoot.removeChild(tooltipContainer);
            }
        }
    }

    _showtoolTip(){
        this._tooltipVisible = true;
        this._render();
    }

    _hidetoolTip(){
        this._tooltipVisible = false;
        this._render();
    }


    // whenever the web component gets removed from DOM
    disconnectedCallback(){
        console.log("disconnected");
        this.tooltipIcon.removeEventListener("mouseenter", this._showtoolTip);
        this.tooltipIcon.removeEventListener("mouseleave", this._hidetoolTip);    
    }
}



// customElements is a predefied JS object
// regsiters custom html element
customElements.define('my-tooltip', Tooltip);
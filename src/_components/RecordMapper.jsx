import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const defaultProps = {};

class RecordMapper extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        var context = this;
        var $ = go.GraphObject.make;  // for conciseness in defining templates
        var myDiagram =
            $(go.Diagram, "mapper-diagram",
                {
                    initialContentAlignment: go.Spot.Center,
                    validCycle: go.Diagram.CycleNotDirected,  // don't allow loops
                    // For this sample, automatically show the state of the diagram's model on the page
                    "ModelChanged": function(e) {
                        if (e.isTransactionFinished) {
                            context.props.onChange(myDiagram.model);
                        }
                    },
                    "undoManager.isEnabled": true
                });
        // This template is a Panel that is used to represent each item in a Panel.itemArray.
        // The Panel is data bound to the item object.
        var fieldTemplate =
            $(go.Panel, "TableRow",  // this Panel is a row in the containing Table
                new go.Binding("portId", "name"),  // this Panel is a "port"
                {
                    background: "transparent",  // so this port's background can be picked by the mouse
                    fromSpot: go.Spot.Right,  // links only go from the right side to the left side
                    toSpot: go.Spot.Left,
                    // allow drawing links from or to this port:
                    fromLinkable: true, toLinkable: true
                },
                $(go.TextBlock,
                    { margin: 4, column: 1, font: "500 13px roboto",
                        alignment: go.Spot.Left,
                        // and disallow drawing links from or to this text:
                        fromLinkable: false, toLinkable: false },
                    new go.Binding("text", "name")),
                $(go.TextBlock,
                    { margin: new go.Margin(0, 5), column: 2, font: "13px roboto", alignment: go.Spot.Left },
                    new go.Binding("text", "info"))
            );
        myDiagram.nodeTemplate =
            $(go.Node, "Auto",
                { movable: false,
                    copyable: false,
                    deletable: false },
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                // this rectangular shape surrounds the content of the node
                $(go.Shape,
                    { fill: "#f5f5f5" }),
                // the content consists of a header and a list of items
                $(go.Panel, "Vertical",
                    // this is the header for the whole node
                    $(go.Panel, "Auto",
                        { stretch: go.GraphObject.Horizontal },  // as wide as the whole node
                        $(go.Shape,
                            { fill: "#4caf50", stroke: null }),
                        $(go.TextBlock,
                            {
                                alignment: go.Spot.Center,
                                margin: 7,
                                stroke: "white",
                                textAlign: "center",
                                font: "bold 12pt roboto"
                            },
                            new go.Binding("text", "key"))),
                    // this Panel holds a Panel for each item object in the itemArray;
                    // each item Panel is defined by the itemTemplate to be a TableRow in this Table
                    $(go.Panel, "Table",
                        {
                            padding: 4,
                            minSize: new go.Size(100, 10),
                            defaultStretch: go.GraphObject.Horizontal,
                            itemTemplate: fieldTemplate
                        },
                        new go.Binding("itemArray", "fields")
                    )  // end Table Panel of items
                )  // end Vertical Panel
            );  // end Node
        myDiagram.linkTemplate =
            $(go.Link,
                {
                    relinkableFrom: true, relinkableTo: true, // let user reconnect links
                    toShortLength: 4,  fromShortLength: 2
                },
                $(go.Shape, { strokeWidth: 1.5 }),
                $(go.Shape, { toArrow: "Standard", stroke: null })
            );
        myDiagram.model =
            $(go.GraphLinksModel,
                {
                    linkFromPortIdProperty: "fromPort",
                    linkToPortIdProperty: "toPort",
                    nodeDataArray: this.props.nodeData,
                    linkDataArray: this.props.linkData
                });
    }


    render() {

    return (
      <React.Fragment>
          <div id="mapper-diagram" style={{height: '100%', width: '100%'}}></div>
      </React.Fragment>
    );
  }
}


function mapStateToProps(state) {
    const { authentication } = state;
    return {
        authentication
    };
}

const connectedRecordMapper = connect(mapStateToProps)(RecordMapper);
export { connectedRecordMapper as RecordMapper };

function bfs(capacity, flow, source, sink, parent) {
    let visited = new Array(capacity.length).fill(false);
    let queue = [source];
    visited[source] = true;

    while (queue.length > 0) {
        let u = queue.shift();
        for (let v = 0; v < capacity.length; v++) {
            if (!visited[v] && capacity[u][v] - flow[u][v] > 0) {
                queue.push(v);
                visited[v] = true;
                parent[v] = u;
                if (v === sink) {
                    return true;
                }
            }
        }
    }
    return false;
}

function edmondsKarp(capacity, source, sink) {
    let n = capacity.length;
    let flow = Array.from({ length: n }, () => new Array(n).fill(0));
    let maxFlow = 0;

    let parent = new Array(n);

    while (bfs(capacity, flow, source, sink, parent)) {
        let pathFlow = Infinity;
        for (let v = sink; v !== source; v = parent[v]) {
            let u = parent[v];
            pathFlow = Math.min(pathFlow, capacity[u][v] - flow[u][v]);
        }

        for (let v = sink; v !== source; v = parent[v]) {
            let u = parent[v];
            flow[u][v] += pathFlow;
            flow[v][u] -= pathFlow;
        }

        maxFlow += pathFlow;
    }

    return { maxFlow, flow };
}

function getDataMaxFlow(result) {
    let lines = result.split('\n');
    let firstLine = lines[0].split(' ');
    const numNodes = Number(firstLine[0]);
    const numArcs = Number(firstLine[1]);
    const sourceNode = Number(firstLine[2]);
    const sinkNode = Number(firstLine[3]);

    let capacity = Array.from({ length: numNodes }, () => new Array(numNodes).fill(0));

    for (let j = 1; j <= numArcs; j++) {
        let arcDetails = lines[j].split(' ').map(Number);
        let emanatingNode = arcDetails[0];
        let terminatingNode = arcDetails[1];
        let maxCapacity = arcDetails[2];
        capacity[emanatingNode][terminatingNode] = maxCapacity;
    }

    let { maxFlow, flow } = edmondsKarp(capacity, sourceNode, sinkNode);
    document.getElementById("results").innerHTML = ""
    for (let i = 0; i < 7; i++) {
        document.getElementById("results").innerHTML += "<br>";
    }
    document.getElementById("results").innerHTML += "<br>";
    document.getElementById("results").innerHTML += "1)";
    document.getElementById("results").innerHTML += "<br>";
    document.getElementById("results").innerHTML += "Maximum flow: " + maxFlow;
    document.getElementById("results").innerHTML += "<br>";
    document.getElementById("results").innerHTML += "Flow values for each arc: ";
    document.getElementById("results").innerHTML += "<br>";
    
    flow.forEach((row, u) => {
        row.forEach((flowValue, v) => {
            if (flowValue > 0) {
                document.getElementById("results").innerHTML += "Flow from " + u + " to " + v + ": " + flowValue;
                document.getElementById("results").innerHTML += "<br>";
            }
        });
    });
}

function findReachableNodes(capacity, flow, source) {
    let reachable = new Array(capacity.length).fill(false);
    let queue = [source];
    reachable[source] = true;
    while (queue.length > 0) {
        let u = queue.shift();
        for (let v = 0; v < capacity.length; v++) {
            if (!reachable[v] && capacity[u][v] - flow[u][v] > 0) {
                reachable[v] = true;
                queue.push(v);
            }
        }
    }
    return reachable;
}

function findMinCutEdges(capacity, reachable) {
    let minCut = [];
    for (let u = 0; u < capacity.length; u++) {
        for (let v = 0; v < capacity.length; v++) {
            if (reachable[u] && !reachable[v] && capacity[u][v] > 0) {
                minCut.push({ from: u, to: v, capacity: capacity[u][v] });
            }
        }
    }
    return minCut;
}

function getDataMinCut(result) {
    let lines = result.split('\n');
    let firstLine = lines[0].split(' ');
    const numNodes = Number(firstLine[0]);
    const numArcs = Number(firstLine[1]);
    const sourceNode = Number(firstLine[2]);
    const sinkNode = Number(firstLine[3]);

    let capacity = Array.from({ length: numNodes }, () => new Array(numNodes).fill(0));

    for (let j = 1; j <= numArcs; j++) {
        let arcDetails = lines[j].split(' ').map(Number);
        let emanatingNode = arcDetails[0];
        let terminatingNode = arcDetails[1];
        let maxCapacity = arcDetails[2];
        capacity[emanatingNode][terminatingNode] = maxCapacity;
    }

    let { flow } = edmondsKarp(capacity, sourceNode, sinkNode);
    let reachable = findReachableNodes(capacity, flow, sourceNode);
    let minCut = findMinCutEdges(capacity, reachable);
    document.getElementById("results").innerHTML += "<br>";
    document.getElementById("results").innerHTML += "2)";
    document.getElementById("results").innerHTML += "<br>";
    document.getElementById("results").innerHTML += "Minimum cut arcs:";
    document.getElementById("results").innerHTML += "<br>";
    minCut.forEach(edge => {
        document.getElementById("results").innerHTML += "Edge from " + edge.from + " to " + edge.to + " with capacity " + edge.capacity;
        document.getElementById("results").innerHTML += "<br>";
    });
}
function bellmanFord(graph, costs, source, numVertices) {
    let dist = Array(numVertices).fill(Infinity);
    let pred = Array(numVertices).fill(-1);
    dist[source] = 0;

    for (let i = 0; i < numVertices - 1; i++) {
        for (let u = 0; u < numVertices; u++) {
            for (let v = 0; v < numVertices; v++) {
                if (graph[u][v] > 0 && dist[u] + costs[u][v] < dist[v]) {
                    dist[v] = dist[u] + costs[u][v];
                    pred[v] = u;
                }
            }
        }
    }
    return { dist, pred };
}

function successiveShortestPath(capacity, costs, source, sink) {
    let n = capacity.length;
    let flow = Array.from({ length: n }, () => new Array(n).fill(0));
    let minCost = 0;

    let residualCapacity = capacity.map(row => row.slice());

    while (true) {
        let { dist, pred } = bellmanFord(residualCapacity, costs, source, n);
        if (dist[sink] === Infinity) break;

        let pathFlow = Infinity;
        for (let v = sink; v != source; v = pred[v]) {
            let u = pred[v];
            pathFlow = Math.min(pathFlow, residualCapacity[u][v]);
        }

        for (let v = sink; v != source; v = pred[v]) {
            let u = pred[v];
            flow[u][v] += pathFlow;
            flow[v][u] -= pathFlow;
            residualCapacity[u][v] -= pathFlow;
            residualCapacity[v][u] += pathFlow;
            minCost += pathFlow * costs[u][v];
        }
    }

    let maxFlow = flow.reduce((total, row) => total + row[sink], 0);
    return { residualCapacity, maxFlow, minCost };
}


function getDataMinCostMaxFlow(result) {
    let lines = result.split('\n');
    let firstLine = lines[0].split(' ');
    const numNodes = Number(firstLine[0]);
    const numArcs = Number(firstLine[1]);
    const sourceNode = Number(firstLine[2]);
    const sinkNode = Number(firstLine[3]);

    let capacity = Array.from({ length: numNodes }, () => new Array(numNodes).fill(0));
    let costs = Array.from({ length: numNodes }, () => new Array(numNodes).fill(Infinity));

    for (let j = 1; j <= numArcs; j++) {
        let arcDetails = lines[j].split(' ').map(Number);
        let emanatingNode = arcDetails[0];
        let terminatingNode = arcDetails[1];
        let maxCapacity = arcDetails[2];
        let cost = arcDetails[3];
        capacity[emanatingNode][terminatingNode] = maxCapacity;
        costs[emanatingNode][terminatingNode] = cost;
    }

    let {residualCapacity, maxFlow, minCost } = successiveShortestPath(capacity, costs, sourceNode, sinkNode);
    document.getElementById("results").innerHTML += "<br>";
    document.getElementById("results").innerHTML += "3)";
    document.getElementById("results").innerHTML += "<br>";
    document.getElementById("results").innerHTML += "Maximum flow: " + maxFlow;
    document.getElementById("results").innerHTML += "<br>";
    document.getElementById("results").innerHTML += "Minimum total cost: " + minCost;
    document.getElementById("results").innerHTML += "<br>";
    document.getElementById("results").innerHTML += "Residual capacity:";
    document.getElementById("results").innerHTML += "<br>";
    residualCapacity.forEach((row, u) => {
        row.forEach((residualCapacity, v) => {
            if (residualCapacity > 0) {
                document.getElementById("results").innerHTML += "Residual capacity from " + u + " to " + v + ": " + residualCapacity;
                document.getElementById("results").innerHTML += "<br>";
            }
        });
    });
}

function dropHandler(event) {
    event.preventDefault();
    if (event.dataTransfer) {
        for (const item of event.dataTransfer.items) {
            if (item.kind === 'file') {
                const file = item.getAsFile();
                const fr = new FileReader();
                fr.onload = function () {
                    getDataMaxFlow(fr.result);
                    getDataMinCut(fr.result);
                    getDataMinCostMaxFlow(fr.result);
                };
                fr.readAsText(file);
            }
        }
    } else {
        let fr = new FileReader();
        fr.onload = function () {
            getDataMaxFlow(fr.result);
            getDataMinCut(fr.result);
            getDataMinCostMaxFlow(fr.result);
        }
        fr.readAsText(event.target.files[0]);
    }
}

function dragOverHandler(event) {
    event.preventDefault();
}

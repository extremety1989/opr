try {
    function findReachableNodes(capacity, flow, source) {
        let reachable = new Array(capacity.length).fill(false);
        let queue = [source];
        reachable[source] = true;
        while (queue.length > 0) {
            let u = queue.shift();
            for (let v = 0; v < capacity.length; v++) {
                if (!reachable[v] && (capacity[u][v] - flow[u][v] > 0)) {
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

    function successiveShortestPath(graph, costs, source, sink) {
        let n = graph.length;
        let flow = Array.from({ length: n }, () => new Array(n).fill(0));
        let minCost = 0;

        while (true) {
            let { dist, pred } = bellmanFord(graph, costs, source, n);
            if (dist[sink] === Infinity) break;

            let pathFlow = Infinity;
            for (let v = sink; v != source; v = pred[v]) {
                let u = pred[v];
                pathFlow = Math.min(pathFlow, graph[u][v]);
            }

            for (let v = sink; v != source; v = pred[v]) {
                let u = pred[v];
                flow[u][v] += pathFlow;
                flow[v][u] -= pathFlow;
                minCost += pathFlow * costs[u][v];
                graph[u][v] -= pathFlow;
                graph[v][u] += pathFlow;
            }
        }

        return { flow, minCost };
    }

    function getData(result) {
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

        let flowResult = edmondsKarp(capacity, sourceNode, sinkNode);
        console.log("Maximum flow:", flowResult.maxFlow);
        console.log("Flow values for each arc:");
        flowResult.flow.forEach((row, index) => {
            row.forEach((flow, j) => {
                if (flow > 0) {
                    if (index === 0) {
                        console.log(`Flow from s to ${j}: ${flow}`);
                    } else if (j === row.length - 1) {
                        console.log(`Flow from ${index} to t: ${flow}`);
                    } else {
                        console.log(`Flow from ${index} to ${j}: ${flow}`);
                    }
                }
            });
        });

        let { flow, minCost } = successiveShortestPath(capacity, costs, sourceNode, sinkNode);
        console.log("Flow matrix:", flow);
        console.log("Minimum total cost:", minCost);
    }

    function edmondsKarp(capacity, source, sink) {
        let n = capacity.length;
        let flow = Array.from({ length: n }, () => new Array(n).fill(0));
        let maxFlow = 0;

        while (true) {
            let parent = Array.from({ length: n }, () => -1);
            let found = bfs(capacity, flow, parent, source, sink);
            if (!found) break;

            let pathFlow = Infinity;
            let s;
            for (let t = sink; t !== source; t = parent[t]) {
                s = parent[t];
                pathFlow = Math.min(pathFlow, capacity[s][t] - flow[s][t]);
            }

            for (let t = sink; t !== source; t = parent[t]) {
                s = parent[t];
                flow[s][t] += pathFlow;
                flow[t][s] -= pathFlow;
            }

            maxFlow += pathFlow;
        }

        let reachable = findReachableNodes(capacity, flow, source);
        let minCut = findMinCutEdges(capacity, reachable);

        console.log("Minimum cut edges:");
        minCut.forEach(edge => {
            if (edge.from === 0) {
                console.log(`Edge from s to ${edge.to} with capacity ${edge.capacity}`);
            } else if (edge.to === n - 1) {
                console.log(`Edge from ${edge.from} to t with capacity ${edge.capacity}`);
            } else {
                console.log(`Edge from ${edge.from} to ${edge.to} with capacity ${edge.capacity}`);
            }
        });

        return { maxFlow, flow, minCut };
    }

    function bfs(capacity, flow, parent, source, sink) {
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
                    if (v === sink) return true;
                }
            }
        }
        return false;
    }

    function dropHandler(event) {
        event.preventDefault();
        if (event.dataTransfer) {
            for (const item of event.dataTransfer.items) {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    const fr = new FileReader();
                    fr.onload = function () {
                        getData(fr.result);
                    };
                    fr.readAsText(file);
                }
            }
        } else {
            let fr = new FileReader();
            fr.onload = function () {
                getData(fr.result);
            }
            fr.readAsText(event.target.files[0]);
        }
    }

    function dragOverHandler(event) {
        event.preventDefault();
    }
} catch (error) {
    alert(error);
}

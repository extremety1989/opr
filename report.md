### Report of Andranik Arakelov


### For max-flow min-cut
I used Edmonds-Karp algorithm instead of Ford-Fulkerson algorithm that finds the maximum flow between two points in a graph. Edmonds-Karp differs from Ford-Fulkerson in that it chooses the next augmenting path using breadth-first search (bfs). So, if there are multiple augmenting paths to choose from, Edmonds-Karp will be sure to choose the shortest augmenting path from the source to the sink. Edmonds-Karp improves the runtime of Ford-Fulkerson, which has time complexity of  
O(VE²) where V is number of vertices and E is number of edges.

You can find code of Endmonds-Karp algorithm in line 22, and BFS in line 1 in main.js.


### For max-flow min-cost
I used Johnson's algorithm that consist of combining of Bellman Ford and Dijkstra algorithm to change negative weights in graph to whole numbers.
                w'(u,v)=w(u,v)+h(u)−h(v) 
where w(u,v) is the original weight of the edge from u to v, and h(u) and h(v) are the shortest path distances from s to u and 
v respectively.  The adjusting of weight is used by distances found by Bellman Ford than after Dijkstra is applied to find the shortest path. Time complexity: (Bellman Ford) + (Changing weights) + (Dijkstra) + (Adjusting weights back after Dijsktra) =  O(VE) + O(E) + V ⋅ O(V log V + E) + O(V²) that is O(V² log V + VE). Where V is number of vertices and E is number of edges.

You can find code of Johnson's algorithm in line 197, Bellman Ford in line 150 and Dijkstra in line 169 in main.js.

The program is run on following link: [https://extremety1989.github.io/opr/].
You can run the program by yourself by running the project on any webserver.
type Props = {
  style: any;
  class?: string;
};

const icon = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM1IiBoZWlnaHQ9IjM1IiByeD0iMTcuNSIgZmlsbD0iIzU0NzlGNyIvPgo8cGF0aCBkPSJNMTcuNSAxNy4xOTIzQzE2LjUzNDYgMTcuMTkyMyAxNS43MDk5IDE2Ljg1MDMgMTUuMDI1OSAxNi4xNjY0QzE0LjM0MiAxNS40ODI0IDE0IDE0LjY1NzcgMTQgMTMuNjkyNEMxNCAxMi43MjcgMTQuMzQyIDExLjkwMjMgMTUuMDI1OSAxMS4yMTgzQzE1LjcwOTkgMTAuNTM0NCAxNi41MzQ2IDEwLjE5MjQgMTcuNSAxMC4xOTI0QzE4LjQ2NTMgMTAuMTkyNCAxOS4yOSAxMC41MzQ0IDE5Ljk3NCAxMS4yMTgzQzIwLjY1OCAxMS45MDIzIDIxIDEyLjcyNyAyMSAxMy42OTI0QzIxIDE0LjY1NzcgMjAuNjU4IDE1LjQ4MjQgMTkuOTc0IDE2LjE2NjRDMTkuMjkgMTYuODUwMyAxOC40NjUzIDE3LjE5MjMgMTcuNSAxNy4xOTIzWk0xMCAyMy4yODg1VjIyLjU4NDZDMTAgMjIuMDk0OSAxMC4xMzMgMjEuNjQxNCAxMC4zOTkgMjEuMjI0MUMxMC42NjUxIDIwLjgwNjggMTEuMDIwNSAyMC40ODYgMTEuNDY1NCAyMC4yNjE2QzEyLjQ1MzggMTkuNzc3IDEzLjQ1MSAxOS40MTM1IDE0LjQ1NjcgMTkuMTcxMkMxNS40NjI1IDE4LjkyODkgMTYuNDc2OSAxOC44MDc4IDE3LjUgMTguODA3OEMxOC41MjMgMTguODA3OCAxOS41Mzc1IDE4LjkyODkgMjAuNTQzMiAxOS4xNzEyQzIxLjU0OSAxOS40MTM1IDIyLjU0NjEgMTkuNzc3IDIzLjUzNDYgMjAuMjYxNkMyMy45Nzk0IDIwLjQ4NiAyNC4zMzQ5IDIwLjgwNjggMjQuNjAwOSAyMS4yMjQxQzI0Ljg2NjkgMjEuNjQxNCAyNSAyMi4wOTQ5IDI1IDIyLjU4NDZWMjMuMjg4NUMyNSAyMy43MTAzIDI0Ljg1MjIgMjQuMDY4OSAyNC41NTY3IDI0LjM2NDRDMjQuMjYxMiAyNC42NTk5IDIzLjkwMjUgMjQuODA3NyAyMy40ODA4IDI0LjgwNzdIMTEuNTE5MkMxMS4wOTc0IDI0LjgwNzcgMTAuNzM4OCAyNC42NTk5IDEwLjQ0MzMgMjQuMzY0NEMxMC4xNDc4IDI0LjA2ODkgMTAgMjMuNzEwMyAxMCAyMy4yODg1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==`;
export const UserIconImg = ({ style, class: className }: Props) => {
  return <img src={icon} style={style} alt={''} className={className || ''} />;
};

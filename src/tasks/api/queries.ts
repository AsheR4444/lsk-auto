const tasksQuery = (address: string) => ({
  query: `
    query AirdropUser($filter: UserFilter!, $tasksFilter: QueryFilter) {
      userdrop {
        user(filter: $filter) {
          tasks(filter: $tasksFilter) {
            tasks {
              id
              description
              progress {
                isCompleted
              }
            }
          }
        }
      }
    }
  `,
  variables: {
    filter: {
      address: address,
    },
  },
})

const claimTaskQuery = (address: string, taskId: number) => ({
  query: `
  mutation UpdateAirdropTaskStatus($input: UpdateTaskStatusInputData!) {
    userdrop {
      updateTaskStatus(input: $input) {
        success
        progress {
          isCompleted
          completedAt
        }
      }
    }
  }
`,
  variables: {
    input: {
      address: address,
      taskID: taskId,
    },
  },
})

const walletInfoQuery = (address: string) => ({
  query: `
    query AirdropUser($filter: UserFilter!, $tasksFilter: QueryFilter) {
      userdrop {
        user(filter: $filter) {
          rank
          points
          referrals {
            totalCount
          }
          tasks(filter: $tasksFilter) {
            tasks {
              id
              description
              progress {
                isCompleted
              }
            }
          }
        }
      }
    }
  `,
  variables: {
    filter: {
      address: address,
    },
  },
})

export { claimTaskQuery, tasksQuery, walletInfoQuery }

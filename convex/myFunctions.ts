import { v } from "convex/values"
import { query, mutation, action } from "./_generated/server"
import { api } from "./_generated/api"

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query function:

export const getCurriculum = query({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.db.query("projects").collect();
  },
});

export const listIdeas = query({
  // Validators for arguments.
  args: {},

  // Query function implementation.
  handler: async (ctx, args) => {
    // Read the database as many times as you need here.
    // See https://docs.convex.dev/database/reading-data.
    return await ctx.db.query("ideas").collect()
  },
})

// You can write data to the database via a mutation function:
export const saveCurriculum = mutation({
  // Validators for arguments.
  args: {
    description: v.string()
  },

  // Mutation function implementation.
  handler: async (ctx, args) => {
    // Insert or modify documents in the database here.
    // Mutations can also read from the database like queries.
    // See https://docs.convex.dev/database/writing-data.

    // Optionally, capture the ID of the newly created document
    const id = await ctx.db.insert("projects", args)

    // Optionally, return a value from your mutation.
    return id
  },
})

// You can fetch data from and send data to third-party APIs via an action:
export const fetchRandomIdea = action({
  // Validators for arguments.
  args: {},

  // Action implementation.
  handler: async (ctx) => {
    // Use the browser-like `fetch` API to send HTTP requests.
    // See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
    const response = await fetch("https://appideagenerator.com/call.php")
    const idea = await response.text()

    // Write or query data by running Convex mutations/queries from within an action
    await ctx.runMutation(api.myFunctions.saveCurriculum, {
      description: idea.trim(),
    })

    // Optionally, return a value from your action
    return idea
  },
})

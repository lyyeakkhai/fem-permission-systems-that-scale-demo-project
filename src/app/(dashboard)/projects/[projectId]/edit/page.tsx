import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import { ActionButton } from "@/components/ui/action-button"
import { deleteProjectAction } from "@/actions/projects"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getProjectById } from "@/dal/projects/queries"
import { ProjectForm } from "@/components/project-form"

export default async function EditProjectPage({
  params,
}: PageProps<"/projects/[projectId]/edit">) {
  const { projectId } = await params

  const project = await getProjectById(projectId)
  if (project == null) return notFound()
    // FIX: Not checking permissions
    // FIX: Not checking if user has access to project
    const user = await getCurrentUser()
    if(user == null) return notFound()
    if (
        user == null ||
        (user.role !== "admin" &&
          project.department != null &&
          user.department !== project.department)
      ) {
        return redirect(`/`)
      }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/projects/${projectId}`}>
            <ArrowLeftIcon className="size-4" />
            <span className="sr-only">Back to project</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Project</h1>
          <p className="text-muted-foreground">{project.name}</p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <ProjectForm project={project} />

        {/* FIX: Missing permission check */}
        {user?.role === "admin" && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete this project and all its documents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ActionButton
              variant="destructive"
              requireAreYouSure
              action={deleteProjectAction.bind(null, projectId)}
            >
              Delete Project
            </ActionButton>
          </CardContent>
        </Card> 
        )}
      </div>
    </div>
  )
}

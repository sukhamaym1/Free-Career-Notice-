import os

def print_tree(startpath, exclude_dirs):
    for root, dirs, files in os.walk(startpath):
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
        level = root.replace(startpath, '').count(os.sep)
        indent = '│   ' * (level - 1) + '├── ' if level > 0 else ''
        if level > 0:
            print('{}{}/'.format(indent, os.path.basename(root)))
        subindent = '│   ' * level + '├── '
        for f in sorted(files):
            if not f.startswith('.'):
                print('{}{}'.format(subindent, f))

print_tree('.', ['node_modules', 'dist', 'build', 'assets'])

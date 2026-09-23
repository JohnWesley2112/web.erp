import { useState } from 'react';
import Grid from '@mui/material/Grid'; // In MUI v9, this is the modern grid
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

export interface TransferItem {
    id: string | number;
    label: string;
}

interface TransferListProps {
    initialLeft?: TransferItem[];
    initialRight?: TransferItem[];
    leftHeader?: string;
    rightHeader?: string;
    onChange?: (left: TransferItem[], right: TransferItem[]) => void;
}

const not = (a: TransferItem[], b: TransferItem[]) =>
    a.filter((value) => b.findIndex((item) => item.id === value.id) === -1);

const intersection = (a: TransferItem[], b: TransferItem[]) =>
    a.filter((value) => b.findIndex((item) => item.id === value.id) !== -1);

const union = (a: TransferItem[], b: TransferItem[]) => [...a, ...not(b, a)];

export default function TransferList({
    initialLeft = [],
    initialRight = [],
    leftHeader = 'Choices',
    rightHeader = 'Chosen',
    onChange,
}: TransferListProps) {
    const [checked, setChecked] = useState<TransferItem[]>([]);
    const [left, setLeft] = useState<TransferItem[]>(initialLeft);
    const [right, setRight] = useState<TransferItem[]>(initialRight);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: TransferItem) => () => {
        const currentIndex = checked.findIndex((item) => item.id === value.id);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items: TransferItem[]) => intersection(checked, items).length;

    const handleToggleAll = (items: TransferItem[]) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        const newRight = right.concat(leftChecked);
        const newLeft = not(left, leftChecked);

        setRight(newRight);
        setLeft(newLeft);
        setChecked(not(checked, leftChecked));
        if (onChange) onChange(newLeft, newRight);
    };

    const handleCheckedLeft = () => {
        const newLeft = left.concat(rightChecked);
        const newRight = not(right, rightChecked);

        setLeft(newLeft);
        setRight(newRight);
        setChecked(not(checked, rightChecked));
        if (onChange) onChange(newLeft, newRight);
    };

    const customList = (title: string, items: TransferItem[]) => (
        <Card sx={{ width: 250, height: 350, display: 'flex', flexDirection: 'column' }}>
            <CardHeader
                sx={{ px: 2, py: 1 }}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        slotProps={{ input: { 'aria-label': 'all items selected' } }}
                    />
                }
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}
            />
            <Divider />
            <List
                sx={{
                    flex: 1,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
                {items.map((value: TransferItem) => {
                    const labelId = `transfer-list-item-${value.id}-label`;

                    return (
                        <ListItemButton key={value.id} role="listitem" onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.findIndex((item) => item.id === value.id) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    slotProps={{ input: { 'aria-labelledby': labelId } }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value.label} />
                        </ListItemButton>
                    );
                })}
            </List>
        </Card>
    );

    return (
        <Grid container spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
            <Grid>{customList(leftHeader, left)}</Grid>
            <Grid>
                <Stack spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Stack>
            </Grid>
            <Grid>{customList(rightHeader, right)}</Grid>
        </Grid>
    );
}